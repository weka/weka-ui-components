/// <reference types="react" />
import './loader.scss';
interface LoaderProps {
    extraClass?: string;
}
declare function Loader({ extraClass }: LoaderProps): JSX.Element;
export default Loader;
