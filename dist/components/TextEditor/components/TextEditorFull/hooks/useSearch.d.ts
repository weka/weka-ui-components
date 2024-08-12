import { IAceEditor } from 'react-ace/lib/types';

declare function useSearch({ allowSearch, editorReady, editor, value }: {
    allowSearch: boolean;
    editorReady: boolean;
    editor?: IAceEditor;
    value: string;
}): string;
export default useSearch;
