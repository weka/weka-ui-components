import { default as React } from 'react';
export type menuItem = {
    hideMenu?: boolean;
    key?: string;
    text?: string;
    disabled?: string;
    tooltip?: string;
    extraClass?: string;
    onClick: () => void;
    content?: any;
};
interface MenuPopperProps {
    open: boolean;
    onClickAway: () => void;
    items: menuItem[];
    anchorEl: HTMLElement | null;
    disablePortal?: boolean;
    extraPopperClass?: string;
}
declare function MenuPopper(props: MenuPopperProps): React.JSX.Element;
export default MenuPopper;