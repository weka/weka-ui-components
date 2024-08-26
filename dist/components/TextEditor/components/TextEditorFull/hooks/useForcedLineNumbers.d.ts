import { IAceEditor } from 'react-ace/lib/types';
declare function useForcedLineNumbers({ editor, value, lines }: {
    editor?: IAceEditor;
    value: string;
    lines?: {
        number: string;
        text: string;
    }[];
}): void;
export default useForcedLineNumbers;
