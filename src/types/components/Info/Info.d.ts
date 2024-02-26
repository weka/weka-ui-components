import { ReactElement } from 'react';
import './info.scss';
interface InfoProps {
    data: ReactElement | string;
    extraClass?: string;
}
declare function Info({ data, extraClass }: InfoProps): JSX.Element;
export default Info;
