import { default as React } from 'react';
import { Control } from 'react-hook-form';
interface ControlTagsBoxProps {
    control: Control<Record<string, unknown>[]>;
    name: string;
    defaultValue?: string[];
    rules?: Record<string, unknown>;
    disabled?: boolean;
}
declare function ControlTagsBox(props: ControlTagsBoxProps): React.JSX.Element;
export default ControlTagsBox;
