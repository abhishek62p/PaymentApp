const express = require("express");
const mainRuoter = require("./routes/index");

const app = express();
app.get("/api/v1", mainRouter);

// app.use("api/v2", v2Router)

app.listen(3000, () => console.log("server running at PORT 3000"));