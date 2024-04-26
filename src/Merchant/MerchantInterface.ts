import { Application, Review } from "../Applytics.types";

export interface MerchantInterface {
    // Get single application details
    get(appId: string, opts?: AppGetOptions): Promise<Application>;

    // Search for applications
    search(searchTerm: string, opts?: AppSearchOptions): Promise<Application[]>;

    // Get application reviews
    reviews(appId: string, opts?: AppReviewOptions): Promise<Review[]>;

    // Normalize application data
    normalizeAppData?(data: any): Application;

    // Normalize review data
    normalizeReviewData?(data: any): Review;
}

export interface AppGetOptions extends RequestOptions {
    // Include reviews
    withReviews?: boolean;
}

export interface AppReviewOptions extends RequestOptions {
    page?: number;
    sort?: string;
}

export interface AppSearchOptions extends RequestOptions {
}

export interface RequestOptions {
    country?: string;
    lang?: string;
}
