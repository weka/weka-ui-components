import { IAceEditor } from 'react-ace/lib/types';
declare function useFoldAll({ editor, shouldFoldAll, value }: {
    editor?: IAceEditor;
    shouldFoldAll: boolean | number;
    value: string;
}): void;
export default useFoldAll;
