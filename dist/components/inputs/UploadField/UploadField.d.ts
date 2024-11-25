import { default as React } from 'react';
declare const ENCODING_TYPES: {
    text: string;
    binary: string;
    base64: string;
};
interface UploadFieldProps {
    onChange?: (newVal: any) => void;
    onReadError?: (error?: Error) => void;
    wrapperClass?: string;
    placeholder?: string;
    label: string;
    error?: string;
    disabled?: boolean;
    tooltipText?: string;
    encoding: keyof typeof ENCODING_TYPES;
}
declare function UploadField(props: UploadFieldProps): React.JSX.Element;
export default UploadField;
