import { default as React } from 'react';
import { SingleValueProps } from 'react-select';
interface ValueProps extends SingleValueProps {
    data: {
        label: string;
        icon?: React.ReactNode;
        subLabel?: string;
    };
}
declare function SingleValue(props: ValueProps): JSX.Element;
export default SingleValue;
