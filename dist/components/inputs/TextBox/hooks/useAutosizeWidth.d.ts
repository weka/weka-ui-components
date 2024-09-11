/// <reference types="react" />
declare function useAutosizeWidth({ value, autosize, inputRef }: {
    value: string | number;
    autosize?: boolean;
    inputRef: React.RefObject<HTMLInputElement>;
}): {
    inputWidth: number;
    calculationBoxRef: import('react').RefObject<HTMLDivElement>;
};
export default useAutosizeWidth;
