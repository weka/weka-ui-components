/**
 * What the editor edits. `json` adds JSON highlighting and parse validation;
 * `text` is plain text with soft line wrapping, for templates such as a Slack
 * message, where completion and decorations still apply.
 */
export const JSON_EDITOR_LANGUAGES = { JSON: 'json', TEXT: 'text' } as const
export type JsonEditorLanguage =
  (typeof JSON_EDITOR_LANGUAGES)[keyof typeof JSON_EDITOR_LANGUAGES]

/** A single autocomplete suggestion offered by a {@link JsonEditorCompletionSource}. */
export interface JsonEditorCompletion {
  /**
   * Text the typed text is matched against, shown in the popup unless
   * {@link displayLabel} overrides it, and inserted unless {@link apply} does.
   */
  label: string
  /** Text shown in the popup instead of {@link label}. */
  displayLabel?: string
  /** Muted text shown to the right of the label (e.g. a short description). */
  detail?: string
  /** Longer text shown in the details panel when the option is highlighted. */
  info?: string
  /** Text inserted on accept, when it differs from {@link label}. */
  apply?: string
}

/** Result returned by a {@link JsonEditorCompletionSource}. */
export interface JsonEditorCompletionResult {
  /** Absolute document offset where the inserted text replaces from. */
  from: number
  options: JsonEditorCompletion[]
  /**
   * While the text typed from `from` to the cursor matches, the list stays
   * open and filters by it instead of asking the source again. Without it,
   * each keystroke asks again.
   */
  validFor?: RegExp
}

/** Document context handed to a completion source, free of engine types. */
export interface JsonEditorCompletionContext {
  /** Whole document text before the cursor (its length is the cursor offset). */
  textBefore: string
  /** Whole document text after the cursor. */
  textAfter: string
  /** True when completion was requested explicitly (not while typing). */
  explicit: boolean
}

/**
 * Produces completions for the cursor position, or `null` to offer none. The
 * caller owns all domain logic (what to suggest, where, how to filter).
 */
export type JsonEditorCompletionSource = (
  context: JsonEditorCompletionContext
) => JsonEditorCompletionResult | null

/**
 * A regex-driven text decoration. Every match in the visible text is wrapped
 * in a span carrying {@link className} (a global class the consumer styles).
 * `className` may be a function of the matched text for per-match styling.
 */
export interface JsonEditorDecoration {
  pattern: RegExp
  className: string | ((match: string) => string)
}

/** A JSON parse error reported by {@link JsonEditorProps.onValidate}. */
export interface JsonEditorValidationError {
  text: string
  /** Zero-based line index of the error. */
  row: number
}

/** Cursor state reported by {@link JsonEditorProps.onCursorActivity}. */
export interface JsonEditorCursorContext {
  textBefore: string
  textAfter: string
  /** Caret viewport coordinates (as `getBoundingClientRect`), null if off-screen. */
  coords: { left: number; top: number; bottom: number } | null
}

/** Options for {@link JsonEditorHandle.insert}. */
export interface JsonEditorInsertOptions {
  /**
   * Move the caret left by this many characters after inserting, so it lands
   * inside the inserted text (e.g. between wrapping quotes).
   */
  cursorOffsetFromEnd?: number
  /**
   * Select this range of the inserted text after inserting, as offsets into
   * `text` (e.g. the label a toolbar wrapped in markup). Takes precedence over
   * `cursorOffsetFromEnd`.
   */
  select?: { from: number; to: number }
}

/** The main selection, as {@link JsonEditorHandle.getSelection} reports it. */
export interface JsonEditorSelection {
  /** The selected text; empty when nothing is selected. */
  text: string
  /** Whether the selection starts at the beginning of a line. */
  atLineStart: boolean
  /** Whether the selection ends at the end of a line, or takes in that line's line break. */
  atLineEnd: boolean
}

/** Imperative handle exposed via `ref`. */
export interface JsonEditorHandle {
  focus: () => void
  /** Replace the selection with `text`, then optionally reposition the caret. */
  insert: (text: string, options?: JsonEditorInsertOptions) => void
  /** The main selection, so a caller can wrap or rewrite it with `insert`. */
  getSelection: () => JsonEditorSelection
  /** Open the autocomplete popup at the current cursor. */
  startCompletion: () => void
}
