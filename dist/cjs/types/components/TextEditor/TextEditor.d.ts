/// <reference types="react" />
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-min-noconflict/ext-searchbox';
import './textEditor.scss';
import { TextEditorProvider } from './context';
interface ParsedData {
    [key: string]: any;
}
export interface TextEditorProps {
    onChange?: () => void;
    readOnly?: boolean;
    value: string;
    onValidate?: () => void;
    extraClass?: string;
    allowSearch?: boolean;
    allowCopy?: boolean;
    shouldFoldAll?: boolean;
    valueForMatched?: ParsedData;
    isValueForMatchedLoading?: boolean;
    mode?: 'text' | 'json';
    initialLine?: number;
    onScroll?: (line: number) => void;
    minLines?: number;
    maxLines?: number;
}
declare function TextEditor(props: TextEditorProps): JSX.Element;
declare namespace TextEditor {
    var Provider: typeof TextEditorProvider;
    var TagsInput: typeof import("./components/TagsInput/TagsInput").default;
    var FoldAllButton: typeof import("./components/FoldAllButton/FoldAllButton").default;
    var FontSizeControls: typeof import("./components/FontSizeControls/FontSizeControls").default;
    var LinesCount: typeof import("./components/LinesCount/LinesCount").default;
}
export default TextEditor;
