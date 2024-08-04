import { SingleValueProps } from 'react-select';

interface ValueProps extends SingleValueProps {
    data: any;
}
declare function SingleValue(props: ValueProps): JSX.Element;
export default SingleValue;
