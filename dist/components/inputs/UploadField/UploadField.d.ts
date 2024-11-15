import { default as React } from 'react';
interface UploadFieldProps {
    onChange?: (newVal: any) => void;
    onReadError?: () => void;
    wrapperClass?: string;
    placeholder?: string;
    label: string;
    error?: string;
    disabled?: boolean;
    tooltipText?: string;
    shouldBeBinary?: boolean;
}
declare function UploadField(props: UploadFieldProps): React.JSX.Element;
export default UploadField;
