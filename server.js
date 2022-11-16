const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello from Node, from inside a docker container.</h1>");
});

app.post("/api/raycloud/product", (req, res) => {
  const body = req.body;
  console.log(body);
  res.json({ code: "0", message: "成功", success: true });
});

app.listen(process.env.PORT || 8080, () => {
  console.log("App running on port 8080...");
});
