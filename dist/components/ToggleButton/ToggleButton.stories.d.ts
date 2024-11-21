import { default as ToggleButtonComponent } from './ToggleButton';
import { default as React } from 'react';
declare const _default: {
    title: string;
    component: typeof ToggleButtonComponent;
    argTypes: {
        onChange: {
            description: string;
            type: {
                name: string;
                required: boolean;
            };
        };
        options: {
            description: string;
            type: {
                name: string;
                required: boolean;
            };
        };
        value: {
            description: string;
            type: {
                name: string;
                required: boolean;
            };
        };
    };
};
export default _default;
export declare const ToggleButton: (args: object) => React.JSX.Element;
