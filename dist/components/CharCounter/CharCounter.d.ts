import { default as React } from 'react';
export interface CharCounterProps {
    maxChars: number;
    messageLength: number;
    hideMaxChars?: boolean;
    extraClass?: string;
}
declare function CharCounter({ maxChars, messageLength, hideMaxChars, extraClass }: CharCounterProps): React.JSX.Element;
export default CharCounter;
