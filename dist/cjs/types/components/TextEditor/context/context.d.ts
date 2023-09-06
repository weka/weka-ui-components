import { PropsWithChildren } from 'react';
declare type TextEditorContextValue = {
    mode?: 'json' | 'text';
    shouldFoldAll?: boolean;
    tags?: string[];
};
declare type TextEditorContextType = {
    value: TextEditorContextValue;
    setTextEditorContext: (setter: (prev: TextEditorContextValue) => TextEditorContextValue) => void;
};
export declare function TextEditorProvider({ children }: PropsWithChildren): JSX.Element;
export declare function useTextEditorContext(isProviderOptional: true): TextEditorContextType | null;
export declare function useTextEditorContext(componentName: string): TextEditorContextType;
export {};
