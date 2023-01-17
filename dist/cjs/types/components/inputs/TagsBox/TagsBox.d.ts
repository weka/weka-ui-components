import { ReactElement } from 'react';
import './tagsBox.scss';
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
export default TagsBox;
