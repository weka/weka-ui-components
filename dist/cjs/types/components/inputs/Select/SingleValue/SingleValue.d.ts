/// <reference types="react" />
import { SingleValueProps } from 'react-select';
import './singleValue.scss';
interface ValueProps extends SingleValueProps {
    data: any;
}
declare function SingleValue(props: ValueProps): JSX.Element;
export default SingleValue;
