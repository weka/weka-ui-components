import { PropsWithChildren } from 'react';
type TextEditorContextValue = {
    mode?: 'json' | 'text';
    shouldFoldAll?: boolean;
    allowSearch?: boolean;
    tags?: string[];
    fontSize: number;
    totalLinesCount?: number;
    visibleLinesCount?: number;
    isLiteMode: boolean;
    loading?: boolean;
    hideContent?: string[];
    shouldDisableSyntaxCheck: Set<'hideContent' | 'tags'>;
    pageStorageKey?: string;
};
type TextEditorContextType = {
    value: TextEditorContextValue;
    setTextEditorContext: (setter: (prev: TextEditorContextValue) => TextEditorContextValue) => void;
};
type TextEditorProviderProps = {
    pageStorageKey?: string;
};
export declare function TextEditorProvider({ children, pageStorageKey }: PropsWithChildren<TextEditorProviderProps>): JSX.Element;
export declare function useTextEditorContext(isProviderOptional: true): TextEditorContextType | null;
export declare function useTextEditorContext(componentName: string): TextEditorContextType;
export {};
