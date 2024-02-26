import { MouseEventHandler } from 'react';
import './button.scss';
export interface ButtonProps {
    children: any;
    disable?: boolean;
    small?: boolean;
    empty?: boolean;
    fullWidth?: boolean;
    isLoading?: boolean;
    extraClass?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    [key: string]: any;
}
declare function Button(props: ButtonProps): JSX.Element;
export default Button;
