import { useEffect } from 'react'

function useKeyEvent(ref, targetKey, funcToActive, keyEvent = 'keydown') {
  function downHandler({ key }) {
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
