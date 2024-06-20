/// <reference types="react" />
import './validityIndicator.scss';
interface ValidityIndicatorProps {
    invalidFieldsLength: number;
}
declare function ValidityIndicator({ invalidFieldsLength }: ValidityIndicatorProps): JSX.Element;
export default ValidityIndicator;
