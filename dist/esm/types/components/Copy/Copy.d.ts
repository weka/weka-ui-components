import { ReactNode } from 'react';
import './copy.scss';
interface CopyProps {
    text: string;
    extraClass?: string;
    copyIcon?: ReactNode;
    copyText?: string;
}
declare function Copy(props: CopyProps): JSX.Element;
export default Copy;
