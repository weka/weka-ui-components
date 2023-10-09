import { PropsWithChildren } from 'react';
declare type TextEditorContextValue = {
    mode?: 'json' | 'text';
    shouldFoldAll?: boolean;
    allowSearch?: boolean;
    tags?: string[];
    fontSize?: number;
    totalLinesCount?: number;
    visibleLinesCount?: number;
    isLiteMode: boolean;
    loading?: boolean;
};
declare type TextEditorContextType = {
    value: TextEditorContextValue;
    setTextEditorContext: (setter: (prev: TextEditorContextValue) => TextEditorContextValue) => void;
};
export declare function TextEditorProvider({ children }: PropsWithChildren): JSX.Element;
export declare function useTextEditorContext(isProviderOptional: true): TextEditorContextType | null;
export declare function useTextEditorContext(componentName: string): TextEditorContextType;
export {};
