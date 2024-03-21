declare function useLinesCount({ value, lines, filteredValue }: {
    value?: string;
    lines?: {
        number: string;
        text: string;
    }[];
    filteredValue?: string;
}): void;
export default useLinesCount;
