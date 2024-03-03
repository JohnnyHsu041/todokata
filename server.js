import http from "http";

import { v4 as uuidv4 } from "uuid";

import { resHeader } from "./const.js";
import errorHandler from "./errorHandler.js";
import resHandler from "./resHandler.js";
import { apiRoute } from "./utils.js";

const todos = [
    {
        id: uuidv4(),
        title: "刷牙",
    },
    {
        id: uuidv4(),
        title: "洗臉",
    },
];

const reqListener = (req, res) => {
    const { url, method } = req;

    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
    });

    let resBody = {
        status: "success",
        data: todos,
    };

    const todosApi = apiRoute(url, "todos");
    if (todosApi) {
        switch (method) {
            case "GET":
                resHandler(res, 200, resBody);
                break;

            case "POST":
                req.on("end", () => {
                    try {
                        const title = JSON.parse(body).title;
                        if (!title) {
                            throw new Error("欄位未填寫正確");
                        }
                        const todo = { id: uuidv4(), title };
                        todos.push(todo);

                        resBody = {
                            status: "success",
                            newData: todo,
                            todos,
                        };
                        resHandler(res, 200, resBody);
                    } catch (error) {
                        errorHandler(res, error);
                    }
                });
                break;

            case "DELETE":
                try {
                    const urlAry = url.split("/");
                    const todoId = urlAry[2];

                    if (urlAry.length === 3 && todoId) {
                        const tIndex = todos.findIndex((t) => t.id === todoId);
                        if (tIndex === -1) {
                            throw new Error("無此ID，請確認是否輸入正確");
                        }
                        todos.splice(tIndex, 1);
                    } else {
                        todos.length = 0;
                    }

                    resHandler(res, 200, resBody);
                } catch (error) {
                    errorHandler(res, error);
                }
                break;

            case "PATCH":
                req.on("end", () => {
                    try {
                        const urlAry = url.split("/");
                        const todoId = urlAry[2];

                        const updatedTitle = JSON.parse(body).title;
                        if (!updatedTitle) {
                            throw new Error("欄位未填寫正確");
                        }

                        if (urlAry.length === 3 && todoId) {
                            const tIndex = todos.findIndex(
                                (t) => t.id === todoId
                            );
                            if (tIndex === -1) {
                                throw new Error("無此ID，請確認是否輸入正確");
                            }

                            todos[tIndex].title = updatedTitle;

                            resBody = {
                                status: "success",
                                updatedContent: updatedTitle,
                                updatedTodo: todos[tIndex],
                                data: todos,
                            };
                            resHandler(res, 200, resBody);
                        }
                    } catch (error) {
                        errorHandler(res, error);
                    }
                });
                break;
        }
    } else if (method === "OPTIONS") {
        res.writeHead(200, resHeader);
        res.end();
    } else {
        resBody = {
            status: "failed",
            message: "查無此路由",
        };
        resHandler(res, 404, resBody);
    }
};

const server = http.createServer(reqListener);
server.listen(process.env.PORT || 3030);
