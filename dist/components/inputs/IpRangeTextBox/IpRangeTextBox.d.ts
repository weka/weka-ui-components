import { default as React } from 'react';
type Subnet = {
    ip: string;
    mask: string;
};
interface IpRangeTextBoxProps {
    disabled?: boolean;
    isRequired?: boolean;
    onChange: (newVal: any) => void;
    value: any;
    subnet: Subnet;
    wrapperClass?: string;
    label: string;
    error: string;
    info?: string;
}
declare function IpRangeTextBox(props: IpRangeTextBoxProps): React.JSX.Element;
export default IpRangeTextBox;
