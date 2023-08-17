/// <reference types="react" />
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-min-noconflict/ext-searchbox';
import './textEditor.scss';
interface ParsedData {
    [key: string]: any;
}
interface JsonEditorProps {
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
    [key: string]: any;
}
declare function TextEditor(props: JsonEditorProps): JSX.Element;
export default TextEditor;
