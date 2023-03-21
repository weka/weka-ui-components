/// <reference types="react" />
import './perPage.scss';
interface PerPageProps {
    value: string | number;
    onChange: (val: string | number) => void;
    options?: Option[];
}
declare function PerPage({ value, onChange, options }: PerPageProps): JSX.Element;
export default PerPage;
