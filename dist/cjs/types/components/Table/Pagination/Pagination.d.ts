/// <reference types="react" />
import './pagination.scss';
interface PaginationProps {
    onPageChange: (page: number) => void;
    totalRows: number;
    rowsPerPage: number;
}
declare function Pagination({ onPageChange, totalRows, rowsPerPage }: PaginationProps): JSX.Element | null;
export default Pagination;
