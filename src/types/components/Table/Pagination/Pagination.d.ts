/// <reference types="react" />
import './pagination.scss';
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
declare function Pagination(props: PaginationProps): JSX.Element | null;
export default Pagination;
