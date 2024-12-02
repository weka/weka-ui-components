import { default as React, ReactNode } from 'react';
interface ErrorPageProps {
    error?: ReactNode | string;
}
declare function ErrorPage({ error }: ErrorPageProps): React.JSX.Element;
export default ErrorPage;
