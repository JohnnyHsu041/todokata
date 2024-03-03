import { resHeader } from "./const.js";
import { resContent } from "./utils.js";

export default function resHandler(res, statusCode, resBody) {
    res.writeHead(statusCode, resHeader);
    res.write(resContent(resBody));
    res.end();
}
