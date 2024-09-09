interface FilterButtonProps {
    onClick: () => void;
    disable?: boolean;
    extraClass?: string;
    tooltipText?: string;
}
declare function FilterButton({ onClick, disable, extraClass, tooltipText }: FilterButtonProps): JSX.Element;
export default FilterButton;
