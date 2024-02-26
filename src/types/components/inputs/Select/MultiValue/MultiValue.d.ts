/// <reference types="react" />
import { MultiValueProps } from 'react-select';
interface ValueProps extends MultiValueProps {
    data: any;
}
declare function MultiValue(props: ValueProps): JSX.Element;
export default MultiValue;
