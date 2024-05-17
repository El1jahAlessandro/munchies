export function truncateString(text: string, maxLength: number) {
    // If the length of str is less than or equal to num
    // just return str--don't truncate it.
    if (text.length <= maxLength) {
        return text;
    }
    // Return str truncated with '...' concatenated to the end of str.
    return text.slice(0, maxLength) + '...';
}
