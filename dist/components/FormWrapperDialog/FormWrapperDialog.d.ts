import { default as React } from 'react';
export interface FormDialogProps {
    isOpen: boolean;
    toggleOpen: () => void;
    title: string;
    info?: string;
    submitText?: string;
    cancelText?: string;
    dialogClass?: string;
    children: React.ReactNode;
    handleSubmit?: () => Promise<void>;
    handleValidate?: () => Promise<void>;
    showCancel?: boolean;
    disabled?: boolean;
    isLoading?: boolean;
    showSubmit?: boolean;
}
declare function FormWrapperDialog(props: FormDialogProps): false | React.JSX.Element;
export default FormWrapperDialog;
