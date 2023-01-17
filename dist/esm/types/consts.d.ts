export declare const EMPTY_STRING = "";
export declare const NOP: () => void;
export declare const TAG_SEPARATOR = ",";
export declare const SAVED_FILTERS = "saved_filters";
export declare const SAVED_HIDDEN = "saved_hidden";
export declare const FILTER_CHANGE_LISTENER = "table-filters-change";
export declare const FILTER_LISTENER = "table-filters";
export declare const GENERAL_ERROR = "Something went wrong. Please refresh the page and try again.";
interface FilterBoxes {
    [key: string]: string;
}
export declare const FILTERBOXES: FilterBoxes;
export declare const NODES_STATUSES: {
    DOWN: string;
    FENCING: string;
    UP: string;
    JOINING: string;
    SYNCING: string;
};
export declare const DRIVES_STATUSES: {
    INACTIVE: string;
    PHASING_IN: string;
    ACTIVE: string;
    PHASING_OUT: string;
};
export declare const STATUS: {
    OK: string;
    UP: string;
    DEGRADED: string;
    DOWN: string;
    READY: string;
    DEACTIVATING: string;
    ACTIVE: string;
    ENABLED: string;
    UPDATING: string;
    CREATING: string;
    DOWNLOADING: string;
    REMOVING: string;
};
export declare const OBS_IS_DETACHING = "DETACHING";
export declare const OBS_MODES: {
    REMOTE: string;
    WRITABLE: string;
    READ_ONLY: string;
};
interface TimeShortenings {
    [key: string]: any;
}
export declare const TIME_PARTS_SHORTENINGS: TimeShortenings;
export {};
