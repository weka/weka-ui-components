import { ReactElement } from 'react';
import './tab.scss';
interface TabProps {
    title: ReactElement | string;
    active: boolean;
    disabled?: boolean;
    wrapperClass?: string;
    setActive: () => void;
    subComponent?: ReactElement | null;
    isSideTab?: boolean;
    isSubTab?: boolean;
}
declare function Tab({ title, subComponent, active, setActive, wrapperClass, disabled, isSideTab, isSubTab }: TabProps): JSX.Element;
export default Tab;
