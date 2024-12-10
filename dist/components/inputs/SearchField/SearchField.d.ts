import { default as React } from 'react';
export interface SearchFieldProps {
    label: string;
    onValueUpdate: (value: string) => void;
    debounceDelay?: number;
    shouldUpdateTerm?: boolean;
}
declare function SearchField(props: SearchFieldProps): React.JSX.Element;
export default SearchField;
