/// <reference types="react" />
import './copy.scss';
interface CopyProps {
    text: string;
    extraClass?: string;
}
declare function Copy({ text, extraClass }: CopyProps): JSX.Element;
export default Copy;
