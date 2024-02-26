declare function useToggle(initialState: boolean): [boolean, () => void];
declare function useToggle<Value1 extends string, Value2 extends string>(initialState: Value1 | Value2, options: [Value1, Value2]): [Value1 | Value2, () => void];
export default useToggle;
