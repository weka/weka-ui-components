/// <reference types="react" />
import './numInput.scss';
interface NumInputProps {
    max: number;
    value: number;
    onChange?: (val?: number) => void;
    numTitle?: string;
    numFocus?: {
        [key: string]: any;
    };
    setNumFocus?: (state: {
        [key: string]: any;
    }) => void;
    initialNumState?: {
        [key: string]: any;
    };
}
declare function NumInput(props: NumInputProps): JSX.Element;
export default NumInput;
