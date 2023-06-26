/// <reference types="react" />
import './pagination.scss';
interface PaginationProps {
    onPageChange: (page: number) => void;
    totalRows: number;
    rowsPerPage: number;
    defaultCurrentPage: number;
    isLoading?: boolean;
}
declare function Pagination({ onPageChange, totalRows, rowsPerPage, defaultCurrentPage, isLoading }: PaginationProps): JSX.Element | null;
export default Pagination;
