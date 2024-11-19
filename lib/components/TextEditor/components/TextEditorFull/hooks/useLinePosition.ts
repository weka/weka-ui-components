import { useEffect } from 'react'
import { IAceEditor } from 'react-ace/lib/types'
import { NOP } from '~consts'
import { useStaticProps } from '~hooks'

function useLinePosition({
  initialLine,
  onScroll,
  editor
}: {
  initialLine?: number
  onScroll?: (line: number) => void
  editor?: IAceEditor
}) {
  const staticProps = useStaticProps({ initialLine })

  useEffect(() => {
    if (editor && typeof staticProps.initialLine === 'number') {
      editor.scrollToLine(staticProps.initialLine - 1, false, false, NOP)
    }
  }, [editor, staticProps.initialLine])

  useEffect(() => {
    if (onScroll && editor) {
      // when scrolled with the scrollbar it returns previous value, so waiting a bit
      let timerId: ReturnType<typeof setTimeout> | null = null

      const handleScroll = () => {
        timerId = setTimeout(() => onScroll(editor.getFirstVisibleRow() + 1))
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
