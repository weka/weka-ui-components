import { useEffect } from 'react'
import { useStaticProps } from '../../../hooks'
import { IAceEditor } from 'react-ace/lib/types'
import { NOP } from '../../../consts'

function useLinePosition({
  initialLineIndex,
  onScroll,
  editor
}: {
  initialLineIndex?: number
  onScroll?: (line: number) => void
  editor?: IAceEditor
}) {
  const staticProps = useStaticProps({ initialLineIndex: initialLineIndex })

  useEffect(() => {
    if (editor && typeof staticProps.initialLineIndex === 'number') {
      editor.scrollToLine(staticProps.initialLineIndex, false, false, NOP)
    }
  }, [editor, staticProps.initialLineIndex])

  useEffect(() => {
    if (onScroll && editor) {
      // when scrolled with the scrollbar it returns previous value, so waiting a bit
      let timerId: ReturnType<typeof setTimeout> | null = null

      const handleScroll = () => {
        timerId = setTimeout(() => onScroll(editor.getFirstVisibleRow()))
      }

      editor.session.on('changeScrollTop', handleScroll)

      return () => {
        editor.session.removeListener('changeScrollTop', handleScroll)

        if (timerId) {
          clearTimeout(timerId)
        }
      }
    }
  }, [editor, onScroll])
}

export default useLinePosition
