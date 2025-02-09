import { default as React, ReactElement } from 'react';
import { MenuPosition } from 'react-select';
export interface TagsBoxProps {
    onChange: (newVal: any) => void;
    value: any;
    wrapperClass?: string;
    warning?: string;
    isRequired?: boolean;
    tagsValidation?: (val: string[]) => string[];
    placeholder?: string | number;
    label: string | ReactElement;
    error?: any;
    info?: any;
    invalidTagText?: string;
    disabled?: boolean;
    isClearable?: boolean;
    menuPortalTarget?: HTMLElement;
    menuPosition?: MenuPosition;
    expandInputOnFocus?: boolean;
}
declare function TagsBox(props: TagsBoxProps): React.JSX.Element;
export default TagsBox;
