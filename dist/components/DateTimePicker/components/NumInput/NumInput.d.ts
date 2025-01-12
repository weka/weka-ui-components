import { default as React } from 'react';
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
declare function NumInput(props: NumInputProps): React.JSX.Element;
export default NumInput;
