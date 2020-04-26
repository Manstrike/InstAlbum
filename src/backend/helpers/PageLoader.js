import request from "request-promise-native";
import validUrl from 'valid-url';

export class PageLoader {
    async execute(url) {
        if (validUrl.isHttpUri(url) || validUrl.isHttpsUri(url)) {
            return await request(url);
        } else {
            throw new Error('not_valid_url');

        }

    }
}