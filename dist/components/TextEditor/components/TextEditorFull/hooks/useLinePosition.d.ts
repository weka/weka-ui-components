import { IAceEditor } from 'react-ace/lib/types';

declare function useLinePosition({ initialLine, onScroll, editor }: {
    initialLine?: number;
    onScroll?: (line: number) => void;
    editor?: IAceEditor;
}): void;
export default useLinePosition;
