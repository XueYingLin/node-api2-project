const express = require("express");

const users = require("./data/db");

const usersRouter = require("./users/users-router");
const welcomeRouter = require("./welcome/welcome-router");

const server = express();
const port = 4000;

server.use(express.json());
server.use("/users", usersRouter);
server.use("/", welcomeRouter);


server.listen(4000, () => {
    console.log(`\n Server Running on http://localhost:${port} ***\n`);
})

