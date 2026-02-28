const path = require("path");
const express = require("express");
const { createRequestHandler } = require("@remix-run/express");

const BUILD_DIR = path.join(process.cwd(), "build");

const app = express();

app.use(express.static("public", { maxAge: "1h" }));
app.use(express.static("public/build", { immutable: true, maxAge: "1y" }));

app.all("*", createRequestHandler({ build: require(BUILD_DIR) }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
