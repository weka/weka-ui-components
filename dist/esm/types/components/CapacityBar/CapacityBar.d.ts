/// <reference types="react" />
import './capacityBar.scss';
interface CapacityBarProps {
    firstUsage?: number;
    firstColor?: string;
    secondUsage?: number;
    secondColor?: string;
}
declare function CapacityBar(props: CapacityBarProps): JSX.Element;
export default CapacityBar;
