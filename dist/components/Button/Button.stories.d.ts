import { Meta, StoryObj } from 'storybook-solidjs';
import { default as ButtonComponent } from './Button';

declare const meta: Meta<typeof ButtonComponent>;
export default meta;
type Story = StoryObj<typeof ButtonComponent>;
export declare const Default: Story;
