import request from "request-promise-native";

export class PageLoader {
    async execute(url) {
        return await request(url);
    }
}