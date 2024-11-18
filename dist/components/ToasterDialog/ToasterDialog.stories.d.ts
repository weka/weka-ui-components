import { StoryFn } from '@storybook/react';
interface DialogStoryArgs {
    successMessage: string;
    errorMessage: string;
}
interface ToasterStoryArgs {
    successToastMessage: string;
    errorToastMessage: string;
}
declare const _default: import('@storybook/csf').ComponentAnnotations<import('@storybook/react/dist/types-a5624094').R, import('@storybook/csf').Args>;
export default _default;
export declare const Dialog: StoryFn<DialogStoryArgs>;
export declare const Toaster: StoryFn<ToasterStoryArgs>;
