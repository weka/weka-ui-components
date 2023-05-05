import { useRef } from 'react'

/**
 * TODO: add description
 */
function useStaticProps<Props>(props: Props): Props {
  return useRef(props).current
}

export default useStaticProps
