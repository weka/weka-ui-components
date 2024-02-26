export interface ParsedData {
    [key: string]: any;
}
declare function useOnlyMatching({ allowSearch, onlyMatching, searchValue, value, valueForMatched }: {
    allowSearch: boolean;
    onlyMatching: boolean;
    searchValue: string;
    value: string;
    valueForMatched?: ParsedData;
}): string;
export default useOnlyMatching;
