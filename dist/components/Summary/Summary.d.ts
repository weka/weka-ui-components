import { ReactNode } from 'react';
interface SummaryProps {
    title: string;
    children: ReactNode;
    expanded?: boolean;
    onExpand?: (expanded: boolean) => void;
}
declare function Summary(props: SummaryProps): JSX.Element;
export default Summary;
