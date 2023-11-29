import { ReactElement } from 'react';
import './customizableSelect.module.scss';
interface CustomizableSelectProps {
    onChange?: (newVal: unknown) => void;
    sortOptions?: boolean;
    disabled?: boolean;
    isRequired?: boolean;
    value?: unknown;
    info?: string | ReactElement;
    wrapperClass?: string;
    error?: string;
    label?: string | ReactElement;
    options: Option[];
    redInfo?: (value: unknown) => string;
    placeholder?: string;
    isClearable?: boolean;
    autoFocus?: boolean;
    groupedOptions?: boolean;
    customValueValidation?: (val: string) => boolean;
    customValueError?: string;
    createLabel?: string;
}
declare function CustomizableSelect(props: CustomizableSelectProps): JSX.Element;
export default CustomizableSelect;
