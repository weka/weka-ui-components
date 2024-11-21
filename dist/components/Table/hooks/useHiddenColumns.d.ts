import { ExtendedColumn, ExtendedColumnDefWithId } from '../types';
import { VisibilityState } from '@tanstack/react-table';
declare function useHiddenColumns<Data, Value>({ columns, filterCategory }: {
    columns: ExtendedColumnDefWithId<Data, Value>[];
    filterCategory: string;
}): {
    hiddenInLocalStorage: Record<string, boolean>;
    onVisibilityChange: (allColumns: ExtendedColumn<Data, Value>[], columnVisibility: VisibilityState) => void;
};
export default useHiddenColumns;
