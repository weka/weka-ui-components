import { default as ToggleButtonComponent } from './ToggleButton';

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
export declare const ToggleButton: (args: any) => JSX.Element;
