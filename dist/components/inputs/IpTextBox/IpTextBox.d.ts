
interface IpTextBoxProps {
    disabled?: boolean;
    isRequired?: boolean;
    onChange: (newVal: any) => void;
    value: string;
    wrapperClass?: string;
    label: string;
    error?: string;
    info?: string;
    allowCopy?: boolean;
}
declare function IpTextBox(props: IpTextBoxProps): JSX.Element;
export default IpTextBox;
