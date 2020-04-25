import request from "request-promise-native";
import validUrl from 'valid-url';

export class PageLoader {
    async execute(url) {
        if (!validUrl.isUri(url)) throw new Error('not_valid_url');

        return await request(url);
    }
}