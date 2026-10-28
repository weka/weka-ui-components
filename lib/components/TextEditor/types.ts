import type ReactAce from 'react-ace'

/** react-ace 15 only exports its package root, which doesn't re-export `IAceEditor`. */
export type IAceEditor = ReactAce['editor']
