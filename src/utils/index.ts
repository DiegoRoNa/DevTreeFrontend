export function classNames(...classes : string[]) {
    return classes.filter(Boolean).join(' ')
}

export function isValidUrl(urlString: string) {
    try {
        new URL(urlString);
        return true;
    } catch (error) {
        return false;
    }
}