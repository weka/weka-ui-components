import { ReactNode } from 'react';
import './errorPage.scss';
interface ErrorPageProps {
    error?: ReactNode | string;
}
declare function ErrorPage({ error }: ErrorPageProps): JSX.Element;
export default ErrorPage;
