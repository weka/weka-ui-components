import { default as React } from 'react';
import { Control } from 'react-hook-form';
interface ControlToggleProps {
    control: Control<Record<string, unknown>[]>;
    name: string;
    defaultValue?: boolean;
}
declare function ControlToggle({ control, name, defaultValue, ...rest }: ControlToggleProps): React.JSX.Element;
export default ControlToggle;
