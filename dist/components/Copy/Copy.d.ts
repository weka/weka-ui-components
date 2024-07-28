import { ReactNode } from 'react';

interface CopyProps {
    text: string;
    extraClass?: string;
    copyIcon?: ReactNode;
    copyText?: string;
}
declare function Copy(props: CopyProps): JSX.Element;
export default Copy;
