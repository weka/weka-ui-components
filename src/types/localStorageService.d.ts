interface ColumnResizing {
    startX?: number | undefined;
    columnWidth: number;
    headerIdWidths: Record<string, number>;
    columnWidths: any;
    isResizingColumn?: string | undefined;
}
declare const localStorageService: {
    setItem(key: string, item: string | boolean): void;
    getItem(key: string): string | null;
    removeItem(key: string): void;
    updateFilters(key: string, value: any): void;
    updateHidden(key: string, value: any): void;
    updateResized(category: string, resizing: ColumnResizing): void;
    updateResizedEnabled(category: string, isResizedEnabled: boolean): void;
};
export default localStorageService;
