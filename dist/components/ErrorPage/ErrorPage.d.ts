import { ReactNode } from 'react';
interface ErrorPageProps {
    error?: ReactNode | string;
}
declare function ErrorPage({ error }: ErrorPageProps): JSX.Element;
export default ErrorPage;
