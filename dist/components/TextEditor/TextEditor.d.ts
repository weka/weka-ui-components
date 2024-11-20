import { ParsedData } from './components';
import { TextEditorProvider } from './context';
import { default as React } from 'react';
export declare const DEFAULT_FONT_SIZE = 16;
interface TextEditorProps {
    onChange?: () => void;
    readOnly?: boolean;
    value?: string;
    onValidate?: () => void;
    extraClass?: string;
    allowSearch?: boolean;
    allowCopy?: boolean;
    /**
     * Determines whether to fold all lines or not. If `true`, all lines will be folded.
     * If a number, it represents the depth of folding. If `false`, all lines will be unfolded.
     */
    foldAll?: boolean | number;
    valueForMatched?: ParsedData;
    isValueForMatchedLoading?: boolean;
    mode?: 'text' | 'json';
    initialLine?: number;
    onScroll?: (line: number) => void;
    maxLines?: number;
    loading?: boolean;
    liteMode?: boolean;
}
declare function TextEditor(props: TextEditorProps): React.JSX.Element;
declare namespace TextEditor {
    var Provider: typeof TextEditorProvider;
    var TagsInput: typeof import("./components/TagsInput/TagsInput").default;
    var FoldAllButton: typeof import("./components/FoldAllButton/FoldAllButton").default;
    var FontSizeControls: typeof import("./components/FontSizeControls/FontSizeControls").default;
    var LinesCount: typeof import("./components/LinesCount/LinesCount").default;
    var SearchButton: typeof import("./components/SearchButton/SearchButton").default;
    var HideContentInput: typeof import("./components/HideContentInput/HideContentInput").default;
}
export default TextEditor;
