export function toPascalCase(string: string | undefined): string {
    return (string?.charAt(0)?.toUpperCase() ?? '') + '' + (string?.slice(1) ?? '');
}
