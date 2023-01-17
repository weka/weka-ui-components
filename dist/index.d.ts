/// <reference types="react" />
import React, { MouseEventHandler, ReactNode, ReactElement } from 'react';

interface ButtonProps {
    children: any;
    disable?: boolean;
    small?: boolean;
    empty?: boolean;
    fullWidth?: boolean;
    isLoading?: boolean;
    extraClass?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    [key: string]: any;
}
declare function Button(props: ButtonProps): JSX.Element;

interface CapacityBarProps {
    firstUsage?: number;
    firstColor?: string;
    secondUsage?: number;
    secondColor?: string;
}
declare function CapacityBar(props: CapacityBarProps): JSX.Element;

interface CircularProgressProps {
    size?: number;
    progress?: number;
    trackColor?: string;
    indicatorWidth?: number;
    indicatorColor?: string;
    indicatorCap: "round" | "inherit" | "butt" | "square" | undefined;
}
declare function CircularProgress(props: CircularProgressProps): JSX.Element;

declare function CloseButton(): JSX.Element;

interface EmptyPageMessageProps {
    children: any;
}
declare function EmptyPageMessage({ children }: EmptyPageMessageProps): JSX.Element;

interface ErrorPageProps {
    error: ReactNode | string;
}
declare function ErrorPage({ error }: ErrorPageProps): JSX.Element;

interface InfoProps {
    data: ReactElement | string;
}
declare function Info({ data }: InfoProps): JSX.Element;

declare function Checkbox(props: any): JSX.Element;

interface DataInfoProps {
    label: string;
    value: string;
}
declare function DataInfo(props: DataInfoProps): JSX.Element;

interface FormSwitchProps {
    label: string;
    info?: string;
    onChange: (newValue: any) => void;
    oneColor?: boolean;
    disabled?: boolean;
    value?: boolean;
    placeholder?: boolean;
    [key: string]: any;
}
declare function FormSwitch({ onChange, oneColor, value, label, placeholder, isRequired, info, ...rest }: FormSwitchProps): JSX.Element;

declare type Subnet = {
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
declare function IpRangeTextBox(props: IpRangeTextBoxProps): JSX.Element;

interface IpSubnetTextBoxProps {
    disabled?: boolean;
    isRequired?: boolean;
    onChange: (newVal: any) => void;
    value: string;
    wrapperClass?: string;
    label: string;
    error?: string;
    info?: string;
}
declare function IpSubnetTextBox(props: IpSubnetTextBoxProps): JSX.Element;

interface IpTextBoxProps {
    disabled?: boolean;
    isRequired?: boolean;
    onChange: (newVal: any) => void;
    value: string;
    wrapperClass?: string;
    label: string;
    error?: string;
    info?: string;
}
declare function IpTextBox(props: IpTextBoxProps): JSX.Element;

interface JsonBoxProps {
    value: string | undefined;
    wrapperClass?: string;
    label: string;
    error?: string;
    disabled?: boolean;
    isRequired?: boolean;
    info?: string;
}
declare function JsonBox(props: JsonBoxProps): JSX.Element;

interface LoginFieldProps {
    onChange: (newVal: any) => void;
    value?: any;
    isRequired?: boolean;
    wrapperClass?: string;
    placeholder?: string;
    label: string | ReactElement;
    type?: string;
    tooltip?: any;
    error?: any;
}
declare function LoginField(props: LoginFieldProps): JSX.Element;

interface RadioSwitchProps {
    label: string;
    value: string;
    checked: boolean;
    onChange: (newVal: any) => void;
    disabled?: boolean;
    info?: string;
}
declare function RadioSwitch({ label, checked, onChange, value, disabled, info }: RadioSwitchProps): JSX.Element;

interface SelectProps {
    onChange?: (newVal: any) => void;
    isMulti?: boolean;
    sortOptions?: boolean;
    disabled?: boolean;
    isRequired?: boolean;
    value?: any;
    info?: any;
    wrapperClass?: string;
    error?: any;
    label: string | ReactElement;
    options: any[];
    redInfo?: any;
    placeholder?: string;
    isClearable?: boolean;
}
declare function Select(props: SelectProps): JSX.Element;

interface TagsBoxProps {
    onChange: (newVal: any) => void;
    value: any;
    wrapperClass?: string;
    warning?: string;
    isRequired?: boolean;
    tagsValidation?: (val: any) => boolean;
    placeholder?: string | number;
    label: string | ReactElement;
    error?: any;
    info?: any;
    invalidTagText?: string;
    disabled?: boolean;
    isClearable?: boolean;
}
declare function TagsBox(props: TagsBoxProps): JSX.Element;

interface TextAreaProps {
    onChange?: (newVal: any) => void;
    value?: any;
    wrapperClass?: string;
    info?: string;
    isRequired?: boolean;
    placeholder?: string | number;
    label: string | ReactElement;
    error?: any;
}
declare const TextArea: (props: TextAreaProps) => JSX.Element;

interface TextBoxProps {
    onChange: (newVal: any) => void;
    value: string | number;
    wrapperClass?: string;
    placeholder?: string | number;
    label: string | ReactElement;
    tooltip?: string | ReactElement;
    error?: any;
    Icon?: ReactElement;
    type?: string;
    isRequired?: boolean;
    info?: any;
    allowDecimal?: boolean;
}
declare const TextBox: React.ForwardRefExoticComponent<TextBoxProps & React.RefAttributes<unknown>>;

interface TextFieldProps {
    onChange: (newVal: any) => void;
    value: string | number;
    wrapperClass?: string;
    error?: any;
    label: string;
    secondLabel?: string;
}
declare function TextField(props: TextFieldProps): JSX.Element;

interface TextSelectBoxProps {
    label: string;
    onChange: (newVal: any) => void;
    isRequired?: boolean;
    selectPlaceholder?: any;
    value?: any;
    wrapperClass?: string;
    error?: string;
    info?: string;
    options: any[];
    formatFunc: (val: any) => any;
}
declare function TextSelectBox(props: TextSelectBoxProps): JSX.Element;

interface UploadFieldProps {
    onChange: (newVal: any) => void;
    onReadError?: () => void;
    wrapperClass?: string;
    placeholder?: string;
    label: string;
    error?: string;
    disabled?: boolean;
}
declare function UploadField(props: UploadFieldProps): JSX.Element;

interface JsonEditorProps {
    onChange?: () => void;
    readOnly?: boolean;
    value?: string;
    onValidate?: () => void;
    [key: string]: any;
}
declare function JsonEditor(props: JsonEditorProps): JSX.Element;

declare function Loader(): JSX.Element;

declare type menuItem = {
    hideMenu?: boolean;
    key?: string;
    text?: string;
    disabled?: string;
    tooltip?: string;
    extraClass?: string;
    onClick: () => void;
    content?: any;
};
interface MenuPopperProps {
    open: boolean;
    onClickAway: () => void;
    items: menuItem[];
    anchorEl: HTMLElement;
    disablePortal?: boolean;
}
declare function MenuPopper(props: MenuPopperProps): JSX.Element;
declare namespace MenuPopper {
    var defaultProps: {
        disablePortal: boolean;
    };
    var propTypes: {};
}

interface NewPasswordTooltipProps {
    passValue?: string;
}
declare function NewPasswordTooltip({ passValue }: NewPasswordTooltipProps): JSX.Element;

interface SpanTooltipProps {
    children: number | string;
    extraClasses: string;
    style?: object;
}
declare function SpanTooltip({ children, extraClasses, style }: SpanTooltipProps): JSX.Element;

interface SwitchProps {
    onChange: (newValue: any) => void;
    disabled?: boolean;
    oneColor?: boolean;
    checked: boolean;
    tooltip?: string;
}
declare function Switch(props: SwitchProps): JSX.Element;

interface TabProps {
    title: ReactElement | string;
    active: boolean;
    disabled?: boolean;
    wrapperClass?: string;
    setActive: () => void;
    subComponent?: ReactElement | null;
    isSideTab?: boolean;
}
declare function Tab({ title, subComponent, active, setActive, wrapperClass, disabled, isSideTab }: TabProps): JSX.Element;

interface ToastProps {
    message: any;
    icon: any;
}
declare function Toast(props: ToastProps): JSX.Element;
declare namespace Toast {
    var propTypes: {};
}

declare type Option = {
    label: string;
    value: string;
};
interface ToggleButtonProps {
    options: Option[];
    value: string;
    onChange: (newVal: any) => void;
}
declare function ToggleButton(props: ToggleButtonProps): JSX.Element;

interface TooltipProps {
    children: ReactElement;
    clear?: boolean;
    data?: ReactElement | string;
    extraClass?: string;
    [key: string]: any;
}
declare function Tooltip({ children, clear, data, extraClass, ...rest }: TooltipProps): JSX.Element;

export { Button, CapacityBar, Checkbox, CircularProgress, CloseButton, DataInfo, EmptyPageMessage, ErrorPage, FormSwitch, Info, IpRangeTextBox, IpSubnetTextBox, IpTextBox, JsonBox, JsonEditor, Loader, LoginField, MenuPopper, NewPasswordTooltip, RadioSwitch, Select, SpanTooltip, Switch, Tab, TagsBox, TextArea, TextBox, TextField, TextSelectBox, Toast, ToggleButton, Tooltip, UploadField };
