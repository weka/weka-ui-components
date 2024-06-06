/// <reference types="react" />
import { ExtendedFilterProps } from '../../../types';
import './textFilter.scss';
export interface TextFilterOptions {
    shouldDisableBtn?: (val: string) => boolean;
    disabledBtnTooltip?: string;
}
declare function TextFilter<Data, Value>({ column, filterOptions }: ExtendedFilterProps<Data, Value, TextFilterOptions>): JSX.Element;
export default TextFilter;
