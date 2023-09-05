/// <reference types="react" />
import './expandCollapseButton.scss';
interface ExpandCollapseButtonProps {
    onChange: (shouldCollapse: boolean) => void;
    shouldCollapse: boolean;
    disabled?: boolean;
}
declare function ExpandCollapseButton(props: ExpandCollapseButtonProps): JSX.Element;
export default ExpandCollapseButton;
