import { ExtendedFilterProps } from '../../../types';
export interface TextFilterOptions {
    shouldDisableBtn?: (val: string) => boolean;
    disabledBtnTooltip?: string;
}
declare function TextFilter<Data, Value>({ column, filterOptions }: ExtendedFilterProps<Data, Value, TextFilterOptions>): JSX.Element;
export default TextFilter;
