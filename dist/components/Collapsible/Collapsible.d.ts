import { default as React } from 'react';
interface CollapsibleProps {
    children: React.ReactNode;
    expanded?: boolean;
    extraClass?: string;
}
declare function Collapsible({ expanded, children, extraClass, ...props }: CollapsibleProps): React.JSX.Element;
export default Collapsible;
