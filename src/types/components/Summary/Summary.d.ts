import { ReactNode } from 'react';
import './summary.scss';
interface SummaryProps {
    title: string;
    children: ReactNode;
    expanded?: boolean;
    onExpand?: (expanded: boolean) => void;
}
declare function Summary(props: SummaryProps): JSX.Element;
export default Summary;
