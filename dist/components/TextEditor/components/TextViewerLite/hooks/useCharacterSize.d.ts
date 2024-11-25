declare function useCharacterSize({ fontSize }: {
    fontSize: number;
}): {
    charHeight: number;
    charWidth: number;
    maximumCharPerColumn: number;
};
export default useCharacterSize;
