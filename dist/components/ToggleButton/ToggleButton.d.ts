
type Option = {
    label: string;
    value: string;
};
interface ToggleButtonProps {
    options: Option[];
    value: string;
    onChange: (newVal: any) => void;
    small?: boolean;
    wrapperClass?: string;
}
declare function ToggleButton(props: ToggleButtonProps): JSX.Element;
export default ToggleButton;
