import React from 'react';
import { ParsedData } from './hooks';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-min-noconflict/ext-searchbox';
import './textEditorFull.scss';
export interface TextEditorFullProps {
    onChange?: () => void;
    readOnly?: boolean;
    value?: string;
    onValidate?: () => void;
    extraClass?: string;
    allowSearch?: boolean;
    allowCopy?: boolean;
    shouldFoldAll?: boolean;
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
declare function TextEditorFull(props: TextEditorFullProps): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof TextEditorFull>;
export default _default;
