import { PropsWithChildren, default as React } from 'react';
declare const DarkModeProvider: (props: PropsWithChildren) => React.JSX.Element;
declare const useDarkMode: () => {
    isDarkMode: boolean;
    isSystem: boolean;
    setTheme: (theme: {
        isDarkMode: boolean;
    } | {
        isSystem: true;
    }) => void;
};
export { DarkModeProvider, useDarkMode };
