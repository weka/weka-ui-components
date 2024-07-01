import { RefObject } from 'react';

declare function useKeyEvent(ref: RefObject<any>, targetKey: string, funcToActive: (arg?: any) => void, keyEvent?: string): void;
export default useKeyEvent;
