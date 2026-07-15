import type {
  JsonEditorCompletionSource,
  JsonEditorCursorContext,
  JsonEditorDecoration
} from './types'
import type { Extension } from '@codemirror/state'

import {
  autocompletion,
  type CompletionContext,
  completionKeymap,
  type CompletionResult
} from '@codemirror/autocomplete'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { json } from '@codemirror/lang-json'
import {
  bracketMatching,
  foldGutter,
  foldKeymap,
  HighlightStyle,
  indentOnInput,
  syntaxHighlighting
} from '@codemirror/language'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import { RangeSetBuilder } from '@codemirror/state'
import {
  Decoration,
  type DecorationSet,
  drawSelection,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
  ViewPlugin,
  type ViewUpdate
} from '@codemirror/view'
import { tags } from '@lezer/highlight'

const MONO_FONT = "'IBM Plex Mono', 'IBM Plex Sans', monospace"
const TEXT_COLOR = 'var(--gray-950-20)'
const TRANSPARENT = 'transparent'
const VALUE_COLOR = 'var(--gray-900-100)'
/**
 * Selection colors come from theme-aware CSS variables set in the SCSS module
 * (bright blue in light, deeper blue in dark); the fallbacks keep a sensible
 * translucent blue if a consumer renders the editor without that module.
 */
const SELECTION_BG =
  'var(--cm-selection-bg, color-mix(in sRGB, var(--blue-500) 32%, transparent))'
const SELECTION_BG_IMPORTANT = `${SELECTION_BG} !important`
const SELECTION_MATCH_BG =
  'var(--cm-selection-match-bg, color-mix(in sRGB, var(--blue-500) 18%, transparent))'
/** Selected autocomplete row — solid, since rows have their own contrast. */
const ROW_SELECTED_BG = 'var(--gray-200-800)'

/**
 * JSON syntax colors (WEKA palette): fuchsia keys, grayscale values and
 * punctuation. References the consumer's v2 theme tokens so light/dark flip.
 */
const jsonHighlightStyle = HighlightStyle.define([
  { tag: tags.propertyName, color: 'var(--fuchsia-600-400)' },
  { tag: [tags.string, tags.special(tags.string)], color: VALUE_COLOR },
  { tag: [tags.number, tags.bool, tags.null], color: VALUE_COLOR },
  { tag: [tags.punctuation, tags.separator], color: 'var(--gray-700-300)' },
  { tag: tags.invalid, color: 'var(--red-500)' }
])

/**
 * Editor chrome (background, gutter, selection, cursor, autocomplete popup).
 * Colors reference the consumer's v2 theme tokens so light/dark flip for free.
 */
function baseTheme(fontSizePx: number): Extension {
  return EditorView.theme({
    '&': {
      color: TEXT_COLOR,
      backgroundColor: TRANSPARENT,
      fontSize: `${fontSizePx}px`,
      height: '100%'
    },
    '.cm-content': {
      fontFamily: MONO_FONT,
      caretColor: TEXT_COLOR
    },
    '.cm-scroller': { fontFamily: MONO_FONT, overflow: 'auto' },
    '&.cm-focused': { outline: 'none' },
    '.cm-gutters': {
      backgroundColor: TRANSPARENT,
      color: 'var(--gray-500)',
      border: 'none',
      fontSize: '12px'
    },
    '.cm-lineNumbers .cm-gutterElement': { padding: '0 3px 0 8px' },
    '.cm-foldGutter .cm-gutterElement': {
      padding: '0 4px',
      color: 'var(--gray-500)'
    },
    '.cm-foldMarker': {
      display: 'inline-block',
      fontSize: '11px',
      lineHeight: '1',
      transition: 'transform 0.1s ease'
    },
    '.cm-activeLine': { backgroundColor: 'var(--gray-100-900)' },
    '.cm-activeLineGutter': { backgroundColor: 'var(--gray-100-900)' },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: TEXT_COLOR },
    '.cm-selectionBackground': { backgroundColor: SELECTION_BG_IMPORTANT },
    '&.cm-focused .cm-selectionBackground': {
      backgroundColor: SELECTION_BG_IMPORTANT
    },
    '.cm-content ::selection, .cm-line::selection': {
      backgroundColor: SELECTION_BG_IMPORTANT,
      color: TEXT_COLOR
    },
    '.cm-selectionMatch': { backgroundColor: SELECTION_MATCH_BG },
    '.cm-tooltip': {
      border: '1px solid var(--gray-200-800)',
      borderRadius: '8px',
      backgroundColor: 'var(--gray-50-950)',
      color: TEXT_COLOR,
      boxShadow: '0 6px 16px rgb(0 0 0 / 35%)'
    },
    '.cm-tooltip-autocomplete > ul > li[aria-selected]': {
      backgroundColor: ROW_SELECTED_BG,
      color: TEXT_COLOR
    },
    '.cm-tooltip-autocomplete > ul > li': {
      fontFamily: MONO_FONT,
      padding: '2px 8px'
    },
    '.cm-completionDetail': {
      marginLeft: '2ch',
      fontStyle: 'italic',
      opacity: '0.65'
    }
  })
}

interface CollectedMatch {
  from: number
  to: number
  className: string
}

function collectMatches(
  text: string,
  offset: number,
  rules: JsonEditorDecoration[]
): CollectedMatch[] {
  const matches: CollectedMatch[] = []
  for (const rule of rules) {
    const flags = rule.pattern.flags.includes('g')
      ? rule.pattern.flags
      : `${rule.pattern.flags}g`
    const regex = new RegExp(rule.pattern.source, flags)
    let match = regex.exec(text)
    while (match !== null) {
      const className =
        typeof rule.className === 'function'
          ? rule.className(match[0])
          : rule.className
      matches.push({
        from: offset + match.index,
        to: offset + match.index + match[0].length,
        className
      })
      if (match.index === regex.lastIndex) {
        regex.lastIndex += 1
      }
      match = regex.exec(text)
    }
  }
  return matches
}

/**
 * Applies caller-supplied regex decorations to the visible text. Matches are
 * sorted and overlaps dropped so the RangeSetBuilder receives ordered,
 * non-overlapping ranges. Rebuilt on every doc/viewport change.
 */
function decorationsPlugin(rules: JsonEditorDecoration[]): Extension {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet

      constructor(view: EditorView) {
        this.decorations = this.build(view)
      }

      update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged) {
          this.decorations = this.build(update.view)
        }
      }

      build(view: EditorView): DecorationSet {
        const matches: CollectedMatch[] = []
        for (const { from, to } of view.visibleRanges) {
          matches.push(
            ...collectMatches(view.state.doc.sliceString(from, to), from, rules)
          )
        }
        matches.sort((a, b) => a.from - b.from || a.to - b.to)
        const builder = new RangeSetBuilder<Decoration>()
        let lastTo = -1
        for (const { from, to, className } of matches) {
          if (from < lastTo) {
            continue
          }
          builder.add(from, to, Decoration.mark({ class: className }))
          lastTo = to
        }
        return builder.finish()
      }
    },
    { decorations: (plugin) => plugin.decorations }
  )
}

/**
 * Bridges the caller's plain-text completion source to CodeMirror's
 * autocomplete. The source receives the document text on either side of the
 * cursor (no engine types) and returns an absolute `from` offset plus options.
 */
function completionAdapter(
  getSource: () => JsonEditorCompletionSource | undefined
): Extension {
  const source = (context: CompletionContext): CompletionResult | null => {
    const resolve = getSource()
    if (!resolve) {
      return null
    }
    const result = resolve({
      textBefore: context.state.doc.sliceString(0, context.pos),
      textAfter: context.state.doc.sliceString(context.pos),
      explicit: context.explicit
    })
    if (!result || result.options.length === 0) {
      return null
    }
    return {
      from: result.from,
      options: result.options.map((option) => ({
        label: option.label,
        detail: option.detail,
        info: option.info,
        apply: option.apply ?? option.label
      }))
    }
  }
  return autocompletion({ override: [source], icons: false })
}

/**
 * Notifies the caller of cursor/selection/scroll changes with the surrounding
 * document text and the caret's viewport coordinates — enough to position an
 * external affordance (e.g. an insert button) without touching the engine.
 */
function cursorActivityPlugin(
  getHandler: () => ((context: JsonEditorCursorContext) => void) | undefined
): Extension {
  return EditorView.updateListener.of((update: ViewUpdate) => {
    const handler = getHandler()
    if (!handler) {
      return
    }
    const scrolled = update.transactions.some((tr) => tr.isUserEvent('select'))
    if (
      !update.selectionSet &&
      !update.docChanged &&
      !update.focusChanged &&
      !scrolled &&
      !update.geometryChanged
    ) {
      return
    }
    const { state, view } = update
    const head = state.selection.main.head
    const rect = view.coordsAtPos(head)
    handler({
      textBefore: state.doc.sliceString(0, head),
      textAfter: state.doc.sliceString(head),
      coords: rect
        ? { left: rect.left, top: rect.top, bottom: rect.bottom }
        : null
    })
  })
}

/**
 * Blocks macOS text substitutions (smart quotes, double-space period) that
 * reach the contenteditable as `insertReplacementText` and would corrupt JSON.
 */
const blockTextSubstitution = EditorView.domEventHandlers({
  beforeinput(event) {
    if (event.inputType === 'insertReplacementText') {
      event.preventDefault()
      return true
    }
    return false
  }
})

/**
 * A single disclosure chevron for the fold gutter: points right when folded,
 * rotated down when open — consistent regardless of fold state.
 */
function foldMarkerDOM(open: boolean): HTMLElement {
  const marker = document.createElement('span')
  marker.className = 'cm-foldMarker'
  marker.setAttribute('aria-hidden', 'true')
  marker.textContent = '›'
  marker.style.transform = open ? 'rotate(90deg)' : 'none'
  return marker
}

export interface JsonEditorExtensionsConfig {
  fontSizePx: number
  showLineNumbers: boolean
  getCompletionSource: () => JsonEditorCompletionSource | undefined
  getCursorHandler: () =>
    | ((context: JsonEditorCursorContext) => void)
    | undefined
}

export function buildBaseExtensions(
  config: JsonEditorExtensionsConfig
): Extension[] {
  return [
    ...(config.showLineNumbers
      ? [lineNumbers(), foldGutter({ markerDOM: foldMarkerDOM })]
      : []),
    highlightActiveLine(),
    highlightActiveLineGutter(),
    drawSelection(),
    history(),
    indentOnInput(),
    bracketMatching(),
    highlightSelectionMatches(),
    json(),
    syntaxHighlighting(jsonHighlightStyle),
    completionAdapter(config.getCompletionSource),
    cursorActivityPlugin(config.getCursorHandler),
    blockTextSubstitution,
    keymap.of([
      ...defaultKeymap,
      ...historyKeymap,
      ...searchKeymap,
      ...foldKeymap,
      ...completionKeymap
    ]),
    baseTheme(config.fontSizePx)
  ]
}

export { decorationsPlugin }
