import { default as React } from 'react';
interface CircularProgressProps {
    size?: number;
    progress?: number;
    trackColor?: string;
    indicatorWidth?: number;
    indicatorColor?: string;
    indicatorCap?: "round" | "inherit" | "butt" | "square";
}
declare function CircularProgress(props: CircularProgressProps): React.JSX.Element;
export default CircularProgress;
