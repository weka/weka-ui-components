import { default as React } from 'react';
type TextViewerLiteProps = {
    value?: string;
    fontSize: number;
    maxLines?: number;
    lines?: {
        number: string;
        text: string;
    }[];
};
declare function TextViewerLite(props: TextViewerLiteProps): React.JSX.Element;
export default TextViewerLite;
