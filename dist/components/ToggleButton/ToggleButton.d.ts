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
}
declare function ToggleButton(props: ToggleButtonProps): JSX.Element;
export default ToggleButton;
