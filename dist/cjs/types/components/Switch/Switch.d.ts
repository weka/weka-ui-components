/// <reference types="react" />
import './switch.scss';
interface SwitchProps {
    onChange: (newValue: any) => void;
    disabled?: boolean;
    oneColor?: boolean;
    checked: boolean;
    tooltip?: string;
}
declare function Switch(props: SwitchProps): JSX.Element;
export default Switch;
