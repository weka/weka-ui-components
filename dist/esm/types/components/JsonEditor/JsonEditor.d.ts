/// <reference types="react" />
import 'ace-builds/src-noconflict/mode-json';
import './jsonEditor.scss';
interface JsonEditorProps {
    onChange?: () => void;
    readOnly?: boolean;
    value?: string;
    onValidate?: () => void;
    extraClass?: string;
    [key: string]: any;
}
declare function JsonEditor(props: JsonEditorProps): JSX.Element;
export default JsonEditor;
