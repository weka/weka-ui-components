import { default as React } from 'react';
interface SignInWithGoogleProps {
    googleApi: string;
    clientId: string;
    scope: string;
    apiCall: (data: {
        provider: string;
        token: string;
    }) => Promise<unknown>;
    responseHandler?: (data: unknown) => void;
    extraClass?: string;
}
declare function SignInWithGoogle({ googleApi, clientId, scope, apiCall, responseHandler, extraClass, ...rest }: SignInWithGoogleProps): React.JSX.Element;
export default SignInWithGoogle;
