declare const localStorageService: {
    setItem(key: string, item: string | boolean): void;
    getItem(key: string): string | null;
    removeItem(key: string): void;
    updateFilters(key: string, value: any): void;
    updateHidden(key: string, value: any): void;
    updateResized(category: string, resizing: Record<string, number>): void;
    updateResizedEnabled(category: string, isResizedEnabled: boolean): void;
};
export default localStorageService;
