import { default as React } from 'react';
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
declare function IpTextBox(props: IpTextBoxProps): React.JSX.Element;
export default IpTextBox;
