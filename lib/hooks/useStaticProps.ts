import { useRef } from 'react'

/**
 * Saves and returns value that was on the first render
 */
function useStaticProps<Props>(props: Props): Props {
  return useRef(props).current
}

export default useStaticProps
