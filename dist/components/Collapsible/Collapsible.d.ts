import { default as React } from 'react';
interface CollapsibleProps {
    children: React.ReactNode;
    expanded?: boolean;
    extraClass?: string;
    label?: string;
    info?: string;
    onToggle?: () => void;
    headerRightContent?: React.ReactNode;
}
declare function Collapsible({ expanded, children, extraClass, label, info, onToggle, headerRightContent, ...props }: CollapsibleProps): React.JSX.Element;
export default Collapsible;
