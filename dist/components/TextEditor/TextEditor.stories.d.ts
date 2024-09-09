import { Meta, StoryObj } from 'storybook-solidjs';
import { default as TextEditorComponent } from './components/TextEditorFull/TextEditorFull';
declare const meta: Meta<typeof TextEditorComponent>;
export default meta;
type Story = StoryObj<typeof TextEditorComponent>;
export declare const Default: Story;
