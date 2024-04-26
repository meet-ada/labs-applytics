import { AppStore } from "./Merchant/AppStore";
import { GooglePlay } from "./Merchant/GooglePlay";

export default class Applytics {
    /**
     * Get AppStore instance
     */
    get appStore() {
        return new AppStore();
    }

    /**
     * Get GooglePlay instance
     */
    get playStore() {
        return new GooglePlay();
    }
}