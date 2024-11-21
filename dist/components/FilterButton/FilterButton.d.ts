import { default as React } from 'react';
interface FilterButtonProps {
    onClick: () => void;
    disable?: boolean;
    extraClass?: string;
    tooltipText?: string;
}
declare function FilterButton({ onClick, disable, extraClass, tooltipText }: FilterButtonProps): React.JSX.Element;
export default FilterButton;
