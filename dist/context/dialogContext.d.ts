import { Dispatch, ReactNode, SetStateAction } from 'react';

interface Dialog {
    title: ReactNode;
    body: ReactNode;
    type?: 'info' | 'success' | 'error';
    cancelText?: string;
    confirmText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}
interface DialogProps {
    dialog: Dialog;
    unSetDialog: () => void;
}
interface DialogProviderProps {
    children: ReactNode;
    [key: string]: any;
}
interface DialogContextType {
    setDialog: Dispatch<SetStateAction<Dialog | null | undefined>>;
    unSetDialog: () => void;
}
declare const Dialog: ({ dialog, unSetDialog }: DialogProps) => JSX.Element;
declare const DialogProvider: (props: DialogProviderProps) => JSX.Element;
declare const useDialog: () => DialogContextType;
export { DialogProvider, useDialog };
