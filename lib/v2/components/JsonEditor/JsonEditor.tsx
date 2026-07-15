import type {
  JsonEditorCompletionSource,
  JsonEditorCursorContext,
  JsonEditorDecoration,
  JsonEditorHandle
} from './types'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { startCompletion } from '@codemirror/autocomplete'
import {
  Annotation,
  Compartment,
  EditorState,
  type Extension,
  Transaction
} from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import clsx from 'clsx'

import { EMPTY_ARRAY, EMPTY_STRING } from '#v2/utils/consts'

import {
  buildLayoutExtensions,
  buildStaticExtensions,
  decorationsPlugin
} from './jsonEditorSetup'

import styles from './jsonEditor.module.scss'

const DEFAULT_FONT_SIZE_PX = 14

/**
 * Marks the document change made when the controlled `value` prop is synced in,
 * so the change listener can skip it and only report genuine user edits.
 */
const VALUE_SYNC = Annotation.define<boolean>()

export interface JsonEditorProps {
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
  placeholder?: string
  minHeight?: number | string
  maxHeight?: number | string
  fontSize?: number
  showLineNumbers?: boolean
  completionSource?: JsonEditorCompletionSource
  decorations?: JsonEditorDecoration[]
  onCursorActivity?: (context: JsonEditorCursorContext) => void
  autoFocus?: boolean
  extraClass?: string
  dataTestId?: string
}

/** Read-only viewers block edits and drop `contenteditable` while staying selectable. */
function readOnlyExtension(readOnly: boolean): Extension {
  return [EditorState.readOnly.of(readOnly), EditorView.editable.of(!readOnly)]
}

export const JsonEditor = forwardRef<
  JsonEditorHandle,
  Readonly<JsonEditorProps>
>(function JsonEditor(
  {
    value,
    onChange,
    readOnly = false,
    placeholder = EMPTY_STRING,
    minHeight,
    maxHeight,
    fontSize = DEFAULT_FONT_SIZE_PX,
    showLineNumbers = true,
    completionSource,
    decorations = EMPTY_ARRAY as JsonEditorDecoration[],
    onCursorActivity,
    autoFocus = false,
    extraClass = EMPTY_STRING,
    dataTestId
  },
  ref
) {
  const parentRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  const onChangeRef = useRef(onChange)
  const completionSourceRef = useRef(completionSource)
  const cursorHandlerRef = useRef(onCursorActivity)
  onChangeRef.current = onChange
  completionSourceRef.current = completionSource
  cursorHandlerRef.current = onCursorActivity

  const readOnlyCompartment = useRef(new Compartment())
  const decorationsCompartment = useRef(new Compartment())
  const layoutCompartment = useRef(new Compartment())

  useEffect(() => {
    const parent = parentRef.current
    if (!parent) {
      return undefined
    }
    const staticExtensions = buildStaticExtensions({
      getCompletionSource: () => completionSourceRef.current,
      getCursorHandler: () => cursorHandlerRef.current
    })
    const extensions: Extension[] = [
      ...staticExtensions,
      layoutCompartment.current.of(
        buildLayoutExtensions({
          fontSizePx: fontSize,
          showLineNumbers,
          placeholder,
          minHeight,
          maxHeight
        })
      ),
      readOnlyCompartment.current.of(readOnlyExtension(readOnly)),
      decorationsCompartment.current.of(decorationsPlugin(decorations)),
      EditorView.updateListener.of((update) => {
        if (!update.docChanged) {
          return
        }
        const isValueSync = update.transactions.some((transaction) =>
          transaction.annotation(VALUE_SYNC)
        )
        if (isValueSync) {
          return
        }
        onChangeRef.current?.(update.state.doc.toString())
      })
    ]
    const view = new EditorView({
      parent,
      state: EditorState.create({ doc: value, extensions })
    })
    viewRef.current = view
    if (autoFocus && !readOnly) {
      view.focus()
    }
    return () => {
      view.destroy()
      viewRef.current = null
    }
    // Built once; prop changes are applied through compartments/effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    viewRef.current?.dispatch({
      effects: readOnlyCompartment.current.reconfigure(
        readOnlyExtension(readOnly)
      )
    })
  }, [readOnly])

  useEffect(() => {
    viewRef.current?.dispatch({
      effects: decorationsCompartment.current.reconfigure(
        decorationsPlugin(decorations)
      )
    })
  }, [decorations])

  useEffect(() => {
    viewRef.current?.dispatch({
      effects: layoutCompartment.current.reconfigure(
        buildLayoutExtensions({
          fontSizePx: fontSize,
          showLineNumbers,
          placeholder,
          minHeight,
          maxHeight
        })
      )
    })
  }, [fontSize, showLineNumbers, placeholder, minHeight, maxHeight])

  useEffect(() => {
    const view = viewRef.current
    if (!view) {
      return
    }
    const current = view.state.doc.toString()
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
        annotations: [VALUE_SYNC.of(true), Transaction.addToHistory.of(false)]
      })
    }
  }, [value])

  useImperativeHandle(
    ref,
    () => ({
      focus: () => viewRef.current?.focus(),
      insert: (text, options) => {
        const view = viewRef.current
        if (!view) {
          return
        }
        const { from, to } = view.state.selection.main
        const caret = from + text.length - (options?.cursorOffsetFromEnd ?? 0)
        view.dispatch({
          changes: { from, to, insert: text },
          selection: { anchor: caret }
        })
        view.focus()
      },
      startCompletion: () => {
        const view = viewRef.current
        if (view) {
          startCompletion(view)
        }
      }
    }),
    []
  )

  return (
    <div
      ref={parentRef}
      className={clsx(styles.jsonEditor, extraClass)}
      data-testid={dataTestId}
    />
  )
})
