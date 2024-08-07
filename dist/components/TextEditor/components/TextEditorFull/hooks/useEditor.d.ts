import { IAceEditor } from 'react-ace/lib/types';

declare function useEditor({ editor, maxLines, minLines, onlyMatching, value }: {
    editor?: IAceEditor;
    maxLines?: number;
    minLines?: number;
    onlyMatching: boolean;
    value: string;
}): void;
export default useEditor;
