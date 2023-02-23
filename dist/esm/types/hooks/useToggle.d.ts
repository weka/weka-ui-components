declare function useToggle(initialState: boolean): [boolean, () => void];
declare function useToggle<Value extends string>(initialState: Value, options: Value[]): [Value, () => void];
export default useToggle;
