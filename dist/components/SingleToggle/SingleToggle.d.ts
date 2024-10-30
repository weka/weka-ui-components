export interface SingleToggleProps {
    isEnabled: boolean;
    enabledText?: string;
    disabledText?: string;
    tooltip?: string;
}
declare function SingleToggle({ isEnabled, enabledText, disabledText, tooltip }: SingleToggleProps): JSX.Element;
export default SingleToggle;
