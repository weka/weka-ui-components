/// <reference types="react" />
import './ToggleButton.scss';
type Option = {
    label: string;
    value: string;
};
interface ToggleButtonProps {
    options: Option[];
    value: string;
    onChange: (newVal: any) => void;
}
declare function ToggleButton(props: ToggleButtonProps): JSX.Element;
export default ToggleButton;
