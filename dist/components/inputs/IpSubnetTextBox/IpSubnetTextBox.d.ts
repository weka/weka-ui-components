import { default as React } from 'react';
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
    fixedSubnet?: number;
    allowCopy?: boolean;
}
declare function IpSubnetTextBox(props: IpSubnetTextBoxProps): React.JSX.Element;
export default IpSubnetTextBox;
