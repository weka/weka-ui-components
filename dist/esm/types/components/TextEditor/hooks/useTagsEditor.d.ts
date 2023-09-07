/// <reference types="react" />
export interface TextEditorPublicState {
    fontSize: number;
}
declare function useTagsEditor(): {
    fontSize?: number | undefined;
    getTextEditorProps: () => {
        setContext: import("react").Dispatch<import("react").SetStateAction<TextEditorPublicState | null>>;
    };
};
export default useTagsEditor;
