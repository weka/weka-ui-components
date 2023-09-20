import { IAceEditor } from 'react-ace/lib/types';
declare function useTags({ editor, value, setForcedOptions }: {
    editor?: IAceEditor;
    value: string;
    setForcedOptions: (newState: (prev: Record<string, unknown>) => {
        value?: string;
        disableFolding?: boolean;
    }) => void;
}): void;
export default useTags;
