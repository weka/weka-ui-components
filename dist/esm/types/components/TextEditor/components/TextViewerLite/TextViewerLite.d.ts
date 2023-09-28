/// <reference types="react" />
import './textViewerLite.scss';
declare type TextViewerLiteProps = {
    value?: string;
    fontSize: number;
    maxLines?: number;
    lines?: {
        number: string;
        text: string;
    }[];
};
declare function TextViewerLite(props: TextViewerLiteProps): JSX.Element;
export default TextViewerLite;
