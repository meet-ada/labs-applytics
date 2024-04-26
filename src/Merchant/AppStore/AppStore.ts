import { Application, Review } from "src/Applytics.types";
import { AppGetOptions, AppReviewOptions, AppSearchOptions, MerchantInterface, RequestOptions } from "../MerchantInterface";
import dayjs from "dayjs";
import { ensureArray } from "./helpers";
import * as c from './constants';

export interface IAppStore extends MerchantInterface {
    baseUrl: string;
    defaultAppOptions: AppGetOptions;
    defaultReviewOptions: AppReviewOptions;
}

export default class AppStore implements IAppStore {
    /**
     * Base URL
     */
    public baseUrl = 'https://itunes.apple.com';

    /**
     * Default app options
     * @type {AppGetOptions}
     */
    defaultAppOptions: AppGetOptions = {
        country: 'us',
        withReviews: false
    };

    /**
     * Default review options
     * @type {AppReviewOptions}
     */
    defaultReviewOptions: AppReviewOptions = {
        country: 'us',
        sort: c.sort.RECENT,
    };

    /**
     * Get single application details
     * @param appId Application ID
     * @param opts Options
     */
    async get(appId: string, opts?: AppGetOptions): Promise<Application> {
        const options = { ...this.defaultAppOptions, ...opts };
        const params = new URLSearchParams(options as any);
        params.set('id', appId);
        
        return fetch(`${this.baseUrl}/lookup?${params.toString()}`).then(res => res.json()).then(data => {
            if (data.resultCount === 0) {
                return {} as Application;
            }

            if (options.withReviews) {
                return this.reviews(appId).then(reviews => {
                    return {
                        ...this.normalizeAppData(data.results[0]),
                        reviews
                    } as Application;
                });
            }

            return this.normalizeAppData(data.results[0]);
        });
    }

    /**
     * Search for applications
     * @param searchTerm Search term
     * @param opts Options
     */
    async search(searchTerm: string, opts?: AppSearchOptions): Promise<Application[]> {
        const options = { ...this.defaultAppOptions, ...opts };
        const params = new URLSearchParams(options as any);
        params.set('term', searchTerm);
        params.set('entity', 'software');

        return fetch(`${this.baseUrl}/search?${params.toString()}`).then(res => res.json()).then(data => {
            if (data.resultCount === 0) {
                throw new Error('No apps found by that search term');
            }

            return data.results.map((result: any) => this.normalizeAppData(result));
        });
    }

    /**
     * Get application reviews
     * @param appId Application ID
     */
    async reviews(appId: string, opts?: AppReviewOptions): Promise<Review[]> {
        const options = { ...this.defaultReviewOptions, ...opts };
        const params = {
            page: options.page || 1,
            sort: options.sort || c.sort.RECENT,
            country: options.country || 'us'
        }

        return fetch(`${this.baseUrl}/${params.country}/rss/customerreviews/page=${params.page}/id=${appId}/sortby=${params.sort}/json`).then(res => res.json()).then(data => {
            if (!data.feed || !data.feed.entry) {
                throw new Error('No reviews found');
            }

            if (data.feed.entry.length === 0) {
                throw new Error('No reviews found');
            }

            const reviews = ensureArray(data.feed.entry);
            return reviews.map((entry: any) => this.normalizeReviewData(entry));
        });
    }

    /**
     * Normalize application data
     * @param data Data to normalize
     */
    normalizeAppData(data: any): Application {
        return {
            id: data.trackId,
            appId: data.bundleId,
            title: data.trackName,
            version: data.version,
            description: data.description,
            summary: data.description.match(/^(.*?)[.!?]\s/)?.[1] || data.description,
            url: data.trackViewUrl,
            icon: data.artworkUrl512 || data.artworkUrl100 || data.artworkUrl60,
            contentRating: data.trackContentRating,
            contentAdvisoryRating: data.contentAdvisoryRating,
            publisher: {
                id: data.artistId,
                name: data.artistName,
                url: data.artistViewUrl,
                website: data.sellerUrl
            },
            rating: {
                score: data.averageUserRating,
                count: data.userRatingCount
            },
            genre: {
                primary: data.primaryGenreName,
                primaryId: data.primaryGenreId,
                genres: data.genres,
                genreIds: data.genreIds
            },
            requiredOsVersion: data.minimumOsVersion,
            languages: data.languageCodesISO2A,
            size: data.fileSizeBytes,
            price: {
                amount: data.price,
                currency: data.currency,
                free: data.price === 0
            },
            releaseDate: dayjs(data.releaseDate).toDate(),
            updatedDate: dayjs(data.currentVersionReleaseDate).toDate(),
            latestRelease: {
                version: data.version,
                releaseDate: dayjs(data.currentVersionReleaseDate).toDate(),
                releaseNotes: data.releaseNotes,
                rating: {
                    score: data.averageUserRatingForCurrentVersion,
                    count: data.userRatingCountForCurrentVersion
                }
            },
            screenshots: data.screenshotUrls,
        } as Application;
    }

    /**
     * Normalize review data
     * @param data Data to normalize
     */
    normalizeReviewData(data: any): Review {
        return {
            id: data.id.label,
            userName: data.author.name.label,
            userUrl: data.author.uri.label,
            version: data['im:version'].label,
            score: parseInt(data['im:rating'].label),
            title: data.title.label,
            text: data.content.label,
            url: data.link.attributes.href,
            updated: dayjs(data.updated.label).toDate()
        }
    }
}