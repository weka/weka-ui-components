import { default as React, ReactNode } from 'react';
import { menuItem } from '../MenuPopper/MenuPopper';
export interface SideBlockProps {
    name: string;
    onSelect: () => void;
    isSelected?: boolean;
    actions?: (menuItem & {
        Icon: React.ReactNode;
    })[];
    description?: string;
    extraClass?: string;
    children: ReactNode;
    info?: string;
}
declare function SideBlock(props: SideBlockProps): React.JSX.Element;
export default SideBlock;
