import { Application, Review } from "~/Applytics.types";
import { AppGetOptions, AppReviewOptions, AppSearchOptions, MerchantInterface } from "../MerchantInterface";
import cheerio from 'cheerio';
import dayjs from "dayjs";
import { extractor, getScriptObject } from "./helpers";
import { GPMAPPINGS } from "./constants";

export interface IGooglePlay extends MerchantInterface {
    baseUrl: string;
}

export default class GooglePlay implements IGooglePlay {
    /**
     * Base URL
     */
    public baseUrl = 'https://play.google.com/store/apps/details';

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
        country: 'us'
    };

    /**
     * Get single application details
     * @param appId 
     * @param opts 
     */
    async get(appId: string, opts?: AppGetOptions): Promise<Application> {
        const options = { ...this.defaultAppOptions, ...opts };
        const params = new URLSearchParams({
            id: appId,
            hl: options.lang || 'en',
            gl: options.country || 'us'
        } as any);

        return fetch(`${this.baseUrl}?${params.toString()}`, {
            redirect: 'follow'
        }).then(res => res.text()).then(data => {
            return this.normalizeAppData({
                id: appId,
                html: data
            });
        });
    }

    /**
     * Search for applications
     * @param searchTerm 
     * @param opts 
     */
    async search(searchTerm: string, opts?: AppSearchOptions): Promise<Application[]> {
        throw new Error("Method not implemented.");
    }

    /**
     * Get application reviews
     * @param appId 
     * @param opts 
     */
    async reviews(appId: string, opts?: AppReviewOptions): Promise<Review[]> {
        throw new Error("Method not implemented.");
    } 

    /**
     * Normalize application data
     * @param data 
     */
    normalizeAppData(data: any): Application {
        const $ = cheerio.load(data.html);
        const schema = JSON.parse($('script[type="application/ld+json"]').html()!);
        const dataExtractor = extractor(GPMAPPINGS)
        const app = dataExtractor(getScriptObject(data.html, 'ds:5'));

        return {
            //raw: app,
            id: data.id,
            appId: data.id,
            title: app.name,
            version: app.version,
            description: app.description,
            summary: app.summary,
            url: schema.url,
            icon: app.icon,
            headerImage: app.headerImage,
            contentRating: schema.contentRating,
            contentAdvisoryRating: schema.contentRating,
            publisher: {
                id: app.developerId,
                name: app.developer,
                website: app.developerWebsite,
            },
            rating: {
                score: parseFloat(schema.aggregateRating.ratingValue),
                count: parseFloat(schema.aggregateRating.ratingCount)
            },
            installs: {
                max: app.maxInstalls,
                min: app.minInstalls,
                text: app.installs
            },
            genre: {
                primary: app.genre,
                primaryId: app.genreId,
                genres: $('div[itemprop="genre"]').map((_, el) => $(el).find('span').text()).get(),
                genreIds: []
            },
            requiredOsVersion: app.androidVersion,
            languages: $('link[rel="alternate"]').map((_, el) => $(el).attr('hreflang')).get(),
            size: data.fileSizeBytes,
            price: {
                amount: parseFloat(schema.offers[0].price),
                currency: schema.offers[0].priceCurrency,
                free: parseFloat(schema.offers[0].price) <= 0
            },
            releaseDate: dayjs(app.released).toDate(),
            updatedDate: dayjs(app.updated).toDate(),
            latestRelease: {
                version: app.version,
                releaseDate: dayjs(app.updated).toDate(),
                releaseNotes: app.recentChanges,
                rating: {
                    score: parseFloat(schema.aggregateRating.ratingValue),
                    count: parseFloat(schema.aggregateRating.ratingCount)
                }
            },
            videoImage: app.videoImage,
            videoUrl: app.video,
            previewVideo: app.previewVideo,
            screenshots: app.screenshots,
            preregister: app.preregister,
            earlyAccessEnabled: app.earlyAccessEnabled,
            isAvailableInPlayPass: app.isAvailableInPlayPass,
            adSupported: app.adSupported
        } as Application;
    }

    /**
     * Normalize review data
     * @param data 
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