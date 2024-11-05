/// <reference types="react" />
export interface SearchFieldProps {
    label: string;
    onValueUpdate: (value: string) => void;
    debounceDelay?: number;
    shouldUpdateTerm?: boolean;
}
declare function SearchField(props: SearchFieldProps): JSX.Element;
export default SearchField;
