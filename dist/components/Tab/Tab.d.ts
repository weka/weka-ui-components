import { ReactElement } from 'react';
interface TabProps {
    title: ReactElement | string;
    active: boolean;
    disabled?: boolean;
    wrapperClass?: string;
    setActive?: () => void;
    subComponent?: ReactElement | null;
    isSideTab?: boolean;
    isSubTab?: boolean;
    navigateTo?: string;
    info?: string;
    hasValidIndicator?: boolean;
    unfilledFields?: unknown[];
}
declare function Tab(props: TabProps): JSX.Element;
export default Tab;
