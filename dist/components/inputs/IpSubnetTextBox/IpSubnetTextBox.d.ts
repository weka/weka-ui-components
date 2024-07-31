
interface IpSubnetTextBoxProps {
    disabled?: boolean;
    isRequired?: boolean;
    onChange: (newVal: any) => void;
    value: string;
    wrapperClass?: string;
    label: string;
    error?: string;
    info?: string;
    shouldConvertSubnet2Mask?: boolean;
    fixedSubnet: number;
}
declare function IpSubnetTextBox(props: IpSubnetTextBoxProps): JSX.Element;
export default IpSubnetTextBox;
