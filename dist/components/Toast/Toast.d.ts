import { default as React } from 'react';
interface ToastProps {
    message: string;
    icon: React.ReactNode;
}
declare function Toast(props: ToastProps): React.JSX.Element;
declare namespace Toast {
    var propTypes: {};
}
export default Toast;
