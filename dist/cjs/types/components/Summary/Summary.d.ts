import { ReactNode } from 'react';
import './summary.scss';
interface SummaryProps {
    title: ReactNode;
    content: ReactNode;
    expanded?: boolean;
    onExpand?: (expanded: boolean) => void;
}
declare function Summary(props: SummaryProps): JSX.Element;
export default Summary;
