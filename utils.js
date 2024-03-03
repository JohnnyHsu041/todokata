export const resContent = (content) => JSON.stringify(content);
export const apiRoute = (url, api) => url.split("/")[1] === api;
