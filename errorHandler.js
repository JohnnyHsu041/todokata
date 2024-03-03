import { resContent } from "./utils.js";
import { resHeader } from "./const.js";

export default function errorHandler(res, error) {
    res.writeHead(400, resHeader);
    res.write(
        resContent({
            status: "failed",
            message: error.message || "錯誤，請確認是否資料有誤",
        })
    );
    res.end();
}
