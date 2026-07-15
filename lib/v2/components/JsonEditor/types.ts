/** A single autocomplete suggestion offered by a {@link JsonEditorCompletionSource}. */
export interface JsonEditorCompletion {
  /** Text shown in the popup and inserted unless {@link apply} overrides it. */
  label: string
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
}

/** Imperative handle exposed via `ref`. */
export interface JsonEditorHandle {
  focus: () => void
  /** Replace the selection with `text`, then optionally reposition the caret. */
  insert: (text: string, options?: JsonEditorInsertOptions) => void
  /** Open the autocomplete popup at the current cursor. */
  startCompletion: () => void
}
