const express = require("express");

const blogRouter = require("./blog/router.js");

const server = express();

server.use(express.json());

server.use("/api/blog", blogRouter);

server.get("/", (req, res) => {
    res.send(`
        <h2>Blog data as below</h2>
        <p>Welcome to the Blog</p>
    `);
});

server.listen(4000, () => {
    console.log("\n Server Running on http://localhost:4000 ***\n");
})