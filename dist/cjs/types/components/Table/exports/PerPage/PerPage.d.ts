import { Dispatch, SetStateAction } from 'react';
import { PER_PAGE_OPTIONS } from '../../../../consts';
import './perPage.scss';
interface PerPageProps {
    value: string | number;
    onChange: ((val: string | number) => void) | Dispatch<SetStateAction<number>>;
    options?: typeof PER_PAGE_OPTIONS;
}
declare function PerPage({ value, onChange, options }: PerPageProps): JSX.Element;
export default PerPage;
