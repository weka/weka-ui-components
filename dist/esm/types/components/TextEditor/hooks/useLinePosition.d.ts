import { IAceEditor } from 'react-ace/lib/types';
declare function useLinePosition({ initialLineIndex, onScroll, editor }: {
    initialLineIndex?: number;
    onScroll?: (line: number) => void;
    editor?: IAceEditor;
}): void;
export default useLinePosition;
