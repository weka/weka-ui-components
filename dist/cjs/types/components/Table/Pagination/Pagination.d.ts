/// <reference types="react" />
import './pagination.scss';
interface PaginationProps {
    onPageChange: (page: number) => void;
    totalRows: number;
    rowsPerPage: number;
    defaultCurrentPage: number;
}
declare function Pagination({ onPageChange, totalRows, rowsPerPage, defaultCurrentPage }: PaginationProps): JSX.Element | null;
export default Pagination;
