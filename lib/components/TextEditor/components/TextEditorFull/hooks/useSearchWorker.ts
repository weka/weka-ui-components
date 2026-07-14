import type {
  CountMatchesOptions,
  CountMatchesResult
} from '../workers/countMatches'
import type {
  SearchWorkerRequest,
  SearchWorkerResponse
} from '../workers/searchWorker'

import { useCallback, useEffect, useRef } from 'react'

import { EMPTY_STRING } from '#consts'

import { countMatches } from '../workers/countMatches'

/**
 * Per-editor match counting off the main thread. The worker is created
 * lazily and the content is only cloned into it when a count actually runs,
 * so editors that never search pay nothing; unmount terminates the worker,
 * freeing the cached content. Falls back to a synchronous count where
 * Worker is unavailable (e.g. jsdom in tests).
 */
function useSearchWorker() {
  const workerRef = useRef<Worker | null>(null)
  const workerUnavailableRef = useRef(false)
  const contentRef = useRef(EMPTY_STRING)
  const contentInWorkerRef = useRef<string | null>(null)
  const requestIdRef = useRef(0)
  const pendingRef = useRef(
    new Map<
      number,
      {
        term: string
        options: CountMatchesOptions
        endIndex?: number
        resolve: (result: CountMatchesResult) => void
      }
    >()
  )

  const countSync = useCallback(
    (
      term: string,
      options: CountMatchesOptions,
      endIndex?: number
    ): CountMatchesResult => {
      const haystack =
        typeof endIndex === 'number'
          ? contentRef.current.slice(0, endIndex)
          : contentRef.current
      return countMatches(haystack, term, options)
    },
    []
  )

  const settlePendingWithSyncCounts = useCallback(() => {
    pendingRef.current.forEach(({ term, options, endIndex, resolve }) => {
      resolve(countSync(term, options, endIndex))
    })
    pendingRef.current.clear()
  }, [countSync])

  const ensureWorker = useCallback(() => {
    if (workerRef.current || workerUnavailableRef.current) {
      return workerRef.current
    }
    if (typeof Worker === 'undefined') {
      workerUnavailableRef.current = true
      return null
    }
    try {
      const worker = new Worker(
        new URL('../workers/searchWorker.ts', import.meta.url),
        { type: 'module' }
      )
      worker.onmessage = (message: MessageEvent<SearchWorkerResponse>) => {
        const { requestId, count, exceeded } = message.data
        const pending = pendingRef.current.get(requestId)
        if (pending) {
          pendingRef.current.delete(requestId)
          pending.resolve({ count, exceeded })
        }
      }
      worker.onerror = () => {
        workerUnavailableRef.current = true
        workerRef.current = null
        worker.terminate()
        settlePendingWithSyncCounts()
      }
      workerRef.current = worker
    } catch {
      workerUnavailableRef.current = true
    }
    return workerRef.current
  }, [settlePendingWithSyncCounts])

  const setContent = useCallback((content: string) => {
    contentRef.current = content
    contentInWorkerRef.current = null
  }, [])

  const countMatchesAsync = useCallback(
    (
      term: string,
      options: CountMatchesOptions,
      endIndex?: number
    ): Promise<CountMatchesResult> => {
      const worker = ensureWorker()
      if (!worker) {
        return Promise.resolve(countSync(term, options, endIndex))
      }
      if (contentInWorkerRef.current !== contentRef.current) {
        const setContentRequest: SearchWorkerRequest = {
          type: 'setContent',
          content: contentRef.current
        }
        worker.postMessage(setContentRequest)
        contentInWorkerRef.current = contentRef.current
      }
      requestIdRef.current += 1
      const countRequest: SearchWorkerRequest = {
        type: 'count',
        requestId: requestIdRef.current,
        term,
        endIndex,
        ...options
      }
      worker.postMessage(countRequest)
      return new Promise((resolve) => {
        pendingRef.current.set(countRequest.requestId, {
          term,
          options,
          endIndex,
          resolve
        })
      })
    },
    [ensureWorker, countSync]
  )

  useEffect(
    () => () => {
      workerRef.current?.terminate()
      workerRef.current = null
      settlePendingWithSyncCounts()
    },
    [settlePendingWithSyncCounts]
  )

  return { setContent, countMatchesAsync }
}

export default useSearchWorker
