const express = require("express");

const users = require("./data/db");

const apiRouter = require("./api/api-router");
const welcomeRouter = require("./welcome/welcome-router");

const server = express();
const port = 4000;

server.use(express.json());
server.use("/api", apiRouter);
server.use("/", welcomeRouter);


server.listen(4000, () => {
    console.log(`\n Server Running on http://localhost:${port} ***\n`);
})

