const express = require("express");
const fs = require("fs");
const { send } = require("express/lib/response");

const app = express();
app.use(express.json());

const getData = () => {
  const result = fs.readFileSync("./app.json");
  const data = JSON.parse(result);
  return data;
};
app.get("/users", (req, res) => {
  res.send(getData());
});

app.post("/users", (req, res) => {
  const { id, name } = req.body;
  let newUser = { id, name, cash: 0, credit: 0 };
  // let jsonUser = JSON.stringify(newUser);
  let dataArr = getData();
  dataArr.push(newUser);
  fs.writeFileSync("./app.json", JSON.stringify(dataArr));
  res.send(newUser);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
