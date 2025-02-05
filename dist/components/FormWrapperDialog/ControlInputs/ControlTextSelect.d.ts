import { default as React } from 'react';
import { Control } from 'react-hook-form';
interface ControlTextSelectValue {
    number: string | number;
    unit: {
        value: string | number;
    };
}
interface ControlTextSelectBoxProps {
    control: Control<Record<string, unknown>[]>;
    name: string;
    defaultValue?: ControlTextSelectValue;
    rules?: Record<string, unknown>;
    label?: string;
    info?: string;
    onChange?: (newValue: string | number) => void;
    placeholder?: ControlTextSelectValue;
    textType?: string;
    options: Option[];
    disabled?: boolean;
    allowDecimal?: boolean;
    hideError?: boolean;
    selectPlaceholder?: string | number;
    wrapperClass?: string;
}
declare function ControlTextSelectBox(props: ControlTextSelectBoxProps): React.JSX.Element;
export default ControlTextSelectBox;
