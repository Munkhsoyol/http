const http = require("http");
const fs = require("fs");
const urlLib = require("url");
const path = require("path");

const server = http.createServer((req, res) => {
    const { headers, url, method } = req;

    res.setHeader("content-type", "text/html");

    if (url === "/") {
        fs.readFile("./src/index.html", "utf8", (error, data) => {
            if(error) {
                res.statusCode = 500;
                res.write("Error ...");
            } else {
                res.statusCode = 200;
                res.write(data);
            }

            res.end();
        });
    } else if (url === "/login") {
        fs.readFile("./src/login.html", "utf8", (error, data) => {
            if(error) {
                res.statusCode = 500;
                res.write("Login Error ...");
            } else {
                res.statusCode = 200;
                res.write(data);
            }

            res.end();
        });
    } else if (url === "/logincheck" && method === "POST") {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk)
        });

        req.on("end", () => {
            const parseBody = Buffer.concat(body).toString();
            const password = parseBody.split("=")[2];
            if(password === "12345") {
                // login success
                res.statusCode = 302;
                res.setHeader("Location", "/home");
                res.end();
            } else {
                // login failed
                res.statusCode = 302;
                res.setHeader("Location", "/error");
                res.end();
            }
            // fs.writeFileSync("logininfo.txt", parseBody);
            // res.write("Hvleej avlaa ...");
            // res.end();
        })
    } else if (url === "/home") {
        // Home
        fs.readFile("./src/home.html", "utf8", (error, data) => {
            res.statusCode = 200;
            res.write(data);
            res.end();
        });
    } else if (url === "/error") {
        // Error
        fs.readFile("./src/error.html", "utf8", (error, data) => {
            res.statusCode = 200;
            res.write(data);
            res.end();
        });
    } else if (
        url.endsWith(".jpg") ||
        url.endsWith(".png") 
    ) {
        const parsed = urlLib.parse(url);
        const fileName = path.basename(parsed.pathname);
        fs.readFile("./src/img/" + fileName, (error, data) => {
            res.statusCode = 200;
            res.setHeader("content-type", "image/png");
            res.end(data);
        });
    } else {
        res.statusCode = 404;
        res.write("<h1>404 not found</h1>");
        res.end();
    }
    
});

server.listen(5000, () => {
    console.log("http сервер 5000 порт дээр аслаа ....");
});