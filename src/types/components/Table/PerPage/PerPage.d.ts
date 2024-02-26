import { Dispatch, SetStateAction } from 'react';
import './perPage.scss';
interface PerPageProps {
    value: string | number;
    onChange: ((val: string | number) => void) | Dispatch<SetStateAction<number>>;
    options?: Option[];
}
declare function PerPage({ value, onChange, options }: PerPageProps): JSX.Element;
export default PerPage;
