import { default as React, ReactElement } from 'react';
export interface InfoProps {
    data: ReactElement | string;
    extraClass?: string;
}
declare function Info({ data, extraClass }: InfoProps): React.JSX.Element;
export default Info;
