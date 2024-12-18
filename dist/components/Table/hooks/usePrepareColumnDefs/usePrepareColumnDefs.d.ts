import { ExtendedColumnDef, ExtendedColumnDefWithId } from '../../types';
declare function usePrepareColumnDefs<Data, Value>({ columnDefs }: {
    columnDefs: ExtendedColumnDef<Data, Value>[];
}): ExtendedColumnDefWithId<Data, Value>[];
export default usePrepareColumnDefs;
