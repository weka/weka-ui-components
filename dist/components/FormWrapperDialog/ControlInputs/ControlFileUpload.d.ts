import { default as React } from 'react';
interface ControlFileUploadProps {
    control: Record<string, unknown>;
    name: string;
    rules?: Record<string, unknown>;
}
declare function ControlFileUpload(props: ControlFileUploadProps): React.JSX.Element;
export default ControlFileUpload;
