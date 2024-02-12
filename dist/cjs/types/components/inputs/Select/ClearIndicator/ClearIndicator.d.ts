/// <reference types="react" />
import { ClearIndicatorProps } from 'react-select';
interface ClearIndicatorProp extends ClearIndicatorProps {
    selectProps: any;
}
declare function ClearIndicator(props: ClearIndicatorProp): false | JSX.Element;
export default ClearIndicator;
