import { default as React, Dispatch, SetStateAction } from 'react';
import { PER_PAGE_OPTIONS } from '../../../../consts';
interface PerPageProps {
    value: string | number;
    onChange: ((val: string | number) => void) | Dispatch<SetStateAction<number>>;
    options?: typeof PER_PAGE_OPTIONS;
}
declare function PerPage({ value, onChange, options }: PerPageProps): React.JSX.Element;
export default PerPage;
