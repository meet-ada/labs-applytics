import * as c from './constants';

export function storeId (countryCode: string) {
    const markets = c.markets;
    const defaultStore = '143441';
    // @ts-ignore
    return (countryCode && markets[countryCode.toUpperCase()]) || defaultStore;
}

export function ensureArray (value: any) {
    if (!value) {
        return [];
    }
    
    if (Array.isArray(value)) {
        return value;
    }
    
    return [value];
}