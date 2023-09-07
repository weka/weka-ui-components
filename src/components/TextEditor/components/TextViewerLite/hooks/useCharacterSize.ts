import { useMemo } from 'react'

function useCharacterSize({ fontSize }: { fontSize: number }) {
  return useMemo(() => {
    const element = document.createElement('div')
    element.className = 'text-viewer-light-character-size'
    element.style.fontSize = `${fontSize}px`
    element.innerText = 'a'

    document.body.appendChild(element)
    const { width, height } = element.getBoundingClientRect()
    document.body.removeChild(element)

    return {
      charHeight: height,
      charWidth: width,
      maximumCharPerColumn: document.body.clientWidth / width
    }
  }, [fontSize])
}

export default useCharacterSize
