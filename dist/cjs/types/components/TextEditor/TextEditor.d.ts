/// <reference types="react" />
import { TextEditorProps } from './components';
import { TextEditorProvider } from './context';
export declare const DEFAULT_FONT_SIZE = 16;
declare function TextEditor(props: TextEditorProps): JSX.Element;
declare namespace TextEditor {
    var Provider: typeof TextEditorProvider;
    var TagsInput: typeof import("./components/TagsInput/TagsInput").default;
    var FoldAllButton: typeof import("./components/FoldAllButton/FoldAllButton").default;
    var FontSizeControls: typeof import("./components/FontSizeControls/FontSizeControls").default;
    var LinesCount: typeof import("./components/LinesCount/LinesCount").default;
}
export default TextEditor;
