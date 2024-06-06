/// <reference types="react" />
import { ExtendedFilterProps } from '../../../types';
import './textFilter.scss';
declare function TextFilter<Data, Value>({ column }: ExtendedFilterProps<Data, Value>): JSX.Element;
export default TextFilter;
