import React, { FC } from 'react';
import './copy.scss';
interface CopyProps {
    text: string;
    extraClass?: string;
    CopyComponent?: FC<{
        onClick: (e: React.MouseEvent) => void;
    }>;
    copyText?: string;
}
declare function Copy(props: CopyProps): JSX.Element;
export default Copy;
