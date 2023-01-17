/// <reference types="react" />
import './uploadField.scss';
interface UploadFieldProps {
    onChange: (newVal: any) => void;
    onReadError?: () => void;
    wrapperClass?: string;
    placeholder?: string;
    label: string;
    error?: string;
    disabled?: boolean;
}
declare function UploadField(props: UploadFieldProps): JSX.Element;
export default UploadField;
