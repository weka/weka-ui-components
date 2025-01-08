import { default as React } from 'react';
export type Option = {
    label: string;
    value: string;
};
interface ToggleButtonProps {
    options: Option[];
    value: string | Array<string | null>;
    onChange: (newVal: any) => void;
    small?: boolean;
    isDisabled?: boolean;
    wrapperClass?: string;
    breakpointIndex?: number;
}
declare function ToggleButton(props: ToggleButtonProps): React.JSX.Element;
export default ToggleButton;
