export declare const EMPTY_STRING = "";
export declare const NOP: () => void;
export declare const TAG_SEPARATOR = ",";
export declare const SAVED_FILTERS = "saved_filters";
export declare const EXPLICITLY_REMOVED_FILTERS = "explicitly_removed_filters";
export declare const SAVED_HIDDEN = "saved_hidden";
export declare const SAVED_RESIZED = "saved_resized";
export declare const SAVED_RESIZING_ENABLED = "saved_resizing_enabled";
export declare const FILTER_CHANGE_LISTENER = "table-filters-change";
export declare const FILTER_LISTENER = "table-filters";
export declare const COLUMN_RESIZING_LISTENER = "column-resizing";
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
export declare const SHORT_DAY_OF_WEEK: string[];
export declare const MONTHS: string[];
export declare const TIME_PARTS: {
    HOUR: string;
    MINUTE: string;
    SECOND: string;
};
export declare const TIME_FORMATS: {
    DATE: string;
    DATE_TIME: string;
    DATE_TIME_SECONDS: string;
    DATE_TIME_SECONDS_MS: string;
};
interface SeverityIcons {
    [key: string]: any;
}
export declare const SEVERITY_DEBUG = "DEBUG";
export declare const SEVERITY_INFO = "INFO";
export declare const SEVERITY_WARNING = "WARNING";
export declare const SEVERITY_MINOR = "MINOR";
export declare const SEVERITY_MAJOR = "MAJOR";
export declare const SEVERITY_CRITICAL = "CRITICAL";
export declare const SEVERITIES: readonly ["DEBUG", "INFO", "WARNING", "MINOR", "MAJOR", "CRITICAL"];
export type Severities = typeof SEVERITIES[number];
export declare const SEVERITIES_ICONS: SeverityIcons;
interface ShortRoles {
    [key: string]: any;
}
export declare const SHORT_ROLES: ShortRoles;
export declare const PER_PAGE_OPTIONS: {
    value: number;
    label: string;
}[];
export declare const ORIGIN_OPTIONS: {
    USER: string;
    WEKA: string;
};
export {};
