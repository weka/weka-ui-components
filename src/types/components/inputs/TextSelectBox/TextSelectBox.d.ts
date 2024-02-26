/// <reference types="react" />
import './textSelectBox.scss';
interface TextSelectBoxProps {
    label: string;
    onChange: (newVal: any) => void;
    isRequired?: boolean;
    selectPlaceholder?: any;
    value?: any;
    wrapperClass?: string;
    error?: string;
    info?: string;
    options: any[];
    formatFunc: (val: any) => any;
}
declare function TextSelectBox(props: TextSelectBoxProps): JSX.Element;
export default TextSelectBox;
