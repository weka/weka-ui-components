/// <reference types="react" />
import './ipSubnetTextBox.scss';
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
}
declare function IpSubnetTextBox(props: IpSubnetTextBoxProps): JSX.Element;
export default IpSubnetTextBox;
