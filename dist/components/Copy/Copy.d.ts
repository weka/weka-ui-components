import { default as React, ReactNode } from 'react';
interface CopyProps {
    text: string;
    extraClass?: string;
    copyIcon?: ReactNode;
    copyText?: string;
}
declare function Copy(props: CopyProps): React.JSX.Element;
export default Copy;
