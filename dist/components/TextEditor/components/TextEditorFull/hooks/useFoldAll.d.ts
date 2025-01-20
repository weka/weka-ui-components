import { IAceEditor } from 'react-ace/lib/types';
declare function useFoldAll({ editor, foldAll, value }: {
    editor?: IAceEditor;
    foldAll: boolean | number;
    value: string;
}): void;
export default useFoldAll;
