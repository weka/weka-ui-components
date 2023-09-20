/// <reference types="react" />
import './textViewerLight.scss';
declare type TextViewerLightProps = {
    value?: string;
    fontSize: number;
    maxLines?: number;
};
declare function TextViewerLight(props: TextViewerLightProps): JSX.Element;
export default TextViewerLight;
