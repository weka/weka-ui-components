import { Meta, StoryObj } from '@storybook/react';
import { default as LoaderComponent } from './Loader';

declare const meta: Meta<typeof LoaderComponent>;
export default meta;
type Story = StoryObj<typeof LoaderComponent>;
export declare const Default: Story;
