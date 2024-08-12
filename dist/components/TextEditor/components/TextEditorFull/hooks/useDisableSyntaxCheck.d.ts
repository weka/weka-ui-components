import { IAceEditor } from 'react-ace/lib/types';

declare function useDisableSyntaxCheck({ editor }: {
    editor?: IAceEditor;
}): void;
export default useDisableSyntaxCheck;
