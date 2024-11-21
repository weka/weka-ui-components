import { default as React } from 'react';
import { ParsedData } from './hooks';
export interface TextEditorFullProps {
    onChange?: () => void;
    readOnly?: boolean;
    value?: string;
    onValidate?: () => void;
    extraClass?: string;
    allowSearch?: boolean;
    allowCopy?: boolean;
    foldAll?: boolean | number;
    valueForMatched?: ParsedData;
    isValueForMatchedLoading?: boolean;
    mode?: 'text' | 'json';
    initialLine?: number;
    onScroll?: (line: number) => void;
    maxLines?: number;
    loading?: boolean;
    lines?: {
        number: string;
        text: string;
    }[];
    fontSize?: number;
}
declare function TextEditorFull(props: TextEditorFullProps): React.JSX.Element;
declare const _default: React.MemoExoticComponent<typeof TextEditorFull>;
export default _default;
