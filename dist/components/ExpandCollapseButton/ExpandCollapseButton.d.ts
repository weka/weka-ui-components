import { default as React } from 'react';
interface ExpandCollapseButtonProps {
    onChange: (shouldCollapse: boolean) => void;
    shouldCollapse: boolean;
    disabled?: boolean;
    tooltip?: string;
}
declare function ExpandCollapseButton(props: ExpandCollapseButtonProps): React.JSX.Element;
export default ExpandCollapseButton;
