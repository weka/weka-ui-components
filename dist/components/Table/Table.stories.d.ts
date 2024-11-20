import { TableProps } from './Table';
declare const _default: import('@storybook/csf').ComponentAnnotations<import('@storybook/react/dist/types-a5624094').R, TableProps<unknown, unknown>>;
export default _default;
interface SampleData {
    id: number;
    name: string;
    age: number;
    status: string;
}
export declare const Default: import('@storybook/csf').AnnotatedStoryFn<import('@storybook/react/dist/types-a5624094').R, TableProps<SampleData, keyof SampleData>>;
