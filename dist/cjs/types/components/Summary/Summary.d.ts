import { ReactNode } from 'react';
import './summary.scss';
interface SummaryProps {
    title: ReactNode;
    content: ReactNode;
}
declare function Summary(props: SummaryProps): JSX.Element;
export default Summary;
