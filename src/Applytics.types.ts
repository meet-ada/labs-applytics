export interface Application extends AppleAppStoreInfo, GooglePlayInfo {
    id: string;
    appId: string;
    title: string;
    version: string;
    description: string;
    summary?: string;
    url: string;
    icon: string;
    contentRating?: string;
    contentAdvisoryRating?: string;
    rating: Rating;
    genre: Genres;
    requiredOsVersion?: string;
    languages: string[];
    size: number;
    price: Price;
    releaseDate: Date;
    updatedDate: Date;
    latestRelease: ReleaseInfo;
    screenshots: string[];
    publisher?: Publisher;
    videoUrl?: string;
    videoImage?: string;
    previewVideo?: string;
    reviews?: Review[];
}

export interface Review {
    id: string
    userName: string
    userUrl: string
    version: string
    score: number
    title: string
    text: string
    url: string
    updated: Date
}

export interface Installs {
    max: number;
    min?: number;
    text?: string;
}

export interface Genres {
    primary: string;
    primaryId: string;
    genres: string[];
    genreIds: string[];
}

export interface OSVersion {
    minimum: string;
}

export interface Price {
    amount: number;
    currency: string;
    free: boolean;
}

export interface Publisher {
    id?: string;
    name: string;
    url?: string;
    website?: string;
}

export interface Rating {
    count: number;
    score: number;
}

export interface ReleaseInfo {
    version: string;
    releaseNotes: string;
    releaseDate: Date;
    rating: Rating;
}

export interface AppleAppStoreInfo {
    gameCenterEnabled?: boolean;
    ipadScreenshots?: string[]; // iPad screenshots
    appletvScreenshots?: string[]; // Apple TV screenshots
    supportedDevices?: string[]; // Supported devices
}

export interface GooglePlayInfo {
    headerImage?: string;
    offersInAppPurchases?: boolean;
    preregister?: boolean;
    earlyAccessEnabled?: boolean;
    isAvailableInPlayPass?: boolean;
    adSupported?: boolean;
}