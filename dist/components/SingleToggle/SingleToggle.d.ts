import { default as React, ChangeEvent } from 'react';
export interface SingleToggleProps {
    isEnabled: boolean;
    onChange: (newValue: ChangeEvent<HTMLInputElement>) => void;
    enabledText?: string;
    disabledText?: string;
    tooltip?: string;
    isToggleDisabled?: boolean;
}
declare function SingleToggle({ isEnabled, onChange, enabledText, disabledText, tooltip, isToggleDisabled, ...rest }: SingleToggleProps): React.JSX.Element;
export default SingleToggle;
