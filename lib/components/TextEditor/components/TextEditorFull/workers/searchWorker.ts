import type { CountMatchesOptions } from './countMatches'

import { countMatches } from './countMatches'

export interface SetContentMessage {
  type: 'setContent'
  content: string
}

export interface CountMessage extends CountMatchesOptions {
  type: 'count'
  requestId: number
  term: string
  /** when set, only matches starting before this document offset are counted */
  endIndex?: number
}

export type SearchWorkerRequest = SetContentMessage | CountMessage

export interface SearchWorkerResponse {
  requestId: number
  count: number
  exceeded: boolean
}

// eslint-disable-next-line weka/no-empty-strings -- importing #consts would pull the whole svgs/utils graph into the worker chunk
let contentCache = ''

onmessage = (message: MessageEvent<SearchWorkerRequest>) => {
  const request = message.data

  if (request.type === 'setContent') {
    contentCache = request.content
  } else if (request.type === 'count') {
    const haystack =
      typeof request.endIndex === 'number'
        ? contentCache.slice(0, request.endIndex)
        : contentCache
    const { count, exceeded } = countMatches(haystack, request.term, request)
    const response: SearchWorkerResponse = {
      requestId: request.requestId,
      count,
      exceeded
    }
    postMessage(response)
  } else {
    // no default action
  }
}
