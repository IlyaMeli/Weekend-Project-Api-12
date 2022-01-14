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
  try {
    const { id, name } = req.body;
    let newUser = { id, name, cash: 0, credit: 0 };
    let dataArr = getData();
    dataArr.find((user) => {
      if (user.id === id) {
        throw new Error("User already exists");
      }
    });
    dataArr.push(newUser);
    fs.writeFileSync("./app.json", JSON.stringify(dataArr));
    res.send(newUser);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

app.put("/users/:id", (req, res) => {
  const { cash } = req.body;
  const { id } = req.params;
  const users = getData();
  const userIdx = users.findIndex((user) => user.id === parseInt(id));
  users[userIdx].cash = cash;
  fs.writeFileSync("./app.json", JSON.stringify(users));
  res.send(users[userIdx]);
});

app.put("/users/:id", (req, res) => {
  const { credit } = req.body;
  const { id } = req.params;
  const users = getData();
  const userIdx = users.findIndex((user) => user.id === parseInt(id));
  users[userIdx].credit = credit;
  fs.writeFileSync("./app.json", JSON.stringify(users));
  res.send(users[userIdx]);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
