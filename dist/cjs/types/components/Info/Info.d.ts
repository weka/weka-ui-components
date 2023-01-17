import { ReactElement } from 'react';
import './info.scss';
interface InfoProps {
    data: ReactElement | string;
}
declare function Info({ data }: InfoProps): JSX.Element;
export default Info;
