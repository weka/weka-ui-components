import { default as React, ReactElement, ReactNode } from 'react';
import { ENCODING_TYPES } from '../../../consts.ts';
interface UploadFieldProps {
    onChange?: (newVal: any) => void;
    onReadError?: (error?: Error) => void;
    wrapperClass?: string;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    tooltipText?: string;
    encoding: keyof typeof ENCODING_TYPES;
    info?: ReactElement | string;
    isRequired?: boolean;
    description?: ReactNode;
}
declare function UploadField(props: UploadFieldProps): React.JSX.Element;
export default UploadField;
