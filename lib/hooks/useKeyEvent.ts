import { RefObject, useEffect } from 'react'

function useKeyEvent(
  ref: RefObject<any>,
  targetKey: string,
  funcToActive: (arg?: any) => void,
  keyEvent = 'keydown'
) {
  function downHandler({ key }: KeyboardEvent) {
    if (key === targetKey) {
      funcToActive()
    }
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener(keyEvent, downHandler)
    }
    return () => {
      if (ref.current) {
        ref.current.removeEventListener(keyEvent, downHandler)
      }
    }
  }, [ref.current, funcToActive])
}

export default useKeyEvent
