import '@testing-library/jest-dom/vitest'

const SELECTION_CHANGE_EVENT = 'selectionchange'
const documentPrototype = Object.getPrototypeOf(document) as Document
const dispatchDocumentEvent = documentPrototype.dispatchEvent
const queuedSelectionChanges = new WeakSet<Event>()

/**
 * Browsers queue `selectionchange` as a task, but happy-dom dispatches it
 * synchronously (capricorn86/happy-dom#2185). CodeMirror then handles it in
 * the middle of its own update and throws. Remove once happy-dom queues it.
 */
documentPrototype.dispatchEvent = function (event: Event) {
  if (
    event.type !== SELECTION_CHANGE_EVENT ||
    queuedSelectionChanges.has(event)
  ) {
    return dispatchDocumentEvent.call(this, event)
  }
  queuedSelectionChanges.add(event)
  setTimeout(() => dispatchDocumentEvent.call(this, event))
  return true
}
