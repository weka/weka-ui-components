import { default as React } from 'react';
import { MultiValueProps } from 'react-select';
interface ValueProps extends MultiValueProps {
    data: any;
}
declare function MultiValue(props: ValueProps): React.JSX.Element;
export default MultiValue;
