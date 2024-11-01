const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();
const rootRouter = require("./routes/index")

const corsOption = {
    origin: "http://localhost:5173",
    method: ["GET", "POST", "PUT", "DELETE"],
    credential: true
}

app.use(cors(corsOption));
app.use(bodyParser.json());
app.use("/api/v1", rootRouter);

// app.use("api/v2")

app.listen(3000, () => console.log("server running at PORT 3000"));