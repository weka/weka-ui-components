import { default as React } from 'react';
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
    SubComponent?: React.ReactNode;
    info?: string;
}
declare function SideBlock(props: SideBlockProps): JSX.Element;
export default SideBlock;
