import { Meta, StoryObj } from 'storybook-solidjs';
import { default as ErrorPageComponent } from './ErrorPage';

declare const meta: Meta<typeof ErrorPageComponent>;
export default meta;
type Story = StoryObj<typeof ErrorPageComponent>;
export declare const Default: Story;
