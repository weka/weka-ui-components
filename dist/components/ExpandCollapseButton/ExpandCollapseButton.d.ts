
interface ExpandCollapseButtonProps {
    onChange: (shouldCollapse: boolean) => void;
    shouldCollapse: boolean;
    disabled?: boolean;
    tooltip?: string;
}
declare function ExpandCollapseButton(props: ExpandCollapseButtonProps): JSX.Element;
export default ExpandCollapseButton;
