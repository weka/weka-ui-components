declare function useTags({ value }: {
    value?: string;
}): {
    number: string;
    text: string;
}[] | undefined;
export default useTags;
