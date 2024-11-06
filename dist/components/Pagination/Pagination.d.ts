import { default as React } from 'react';
type PaginationProps = {
    onPageChange: (page: number) => void;
    defaultCurrentPage?: number;
    isLoading?: boolean;
} & ({
    totalRows: number;
    rowsPerPage: number;
    numberOfPages?: undefined;
} | {
    numberOfPages: number;
    totalRows?: undefined;
    rowsPerPage?: undefined;
});
declare function Pagination(props: PaginationProps): React.JSX.Element | null;
export default Pagination;
