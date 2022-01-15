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
// get all users
app.get("/users", (req, res) => {
  res.send(getData());
});
//get one users
app.get("/users/:id", (req, res) => {
  try {
    const users = getData();
    const { id } = req.params;
    const user = users.find((user) => user.id === Number(id));
    if (!user) {
      throw new Error("User not found");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
//add new user
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
//deposit cash to user
app.put("/users/deposit/:id", (req, res) => {
  try {
    const { cash } = req.body;
    if (!cash) {
      throw new Error("Invalid Value");
    }
    const { id } = req.params;
    const users = getData();
    const userIdx = users.findIndex((user) => user.id === parseInt(id));
    users[userIdx].cash += cash;
    if (cash < 0) {
      throw new Error("Cannot deposit negetive amount");
    }
    fs.writeFileSync("./app.json", JSON.stringify(users));
    res.send(users[userIdx]);
  } catch (error) {
    res.send({ error: error.message });
  }
});
// change credit of user
app.put("/users/credit/:id", (req, res) => {
  try {
    const { credit } = req.body;
    if (!credit) {
      throw new Error("Invalid Value");
    }
    const { id } = req.params;
    const users = getData();
    const userIdx = users.findIndex((user) => user.id === parseInt(id));
    users[userIdx].credit = credit;

    if (credit < 0) {
      throw new Error("Credit cannot be negative");
    }
    fs.writeFileSync("./app.json", JSON.stringify(users));
    res.send(users[userIdx]);
  } catch (error) {
    res.send({ error: error.message });
  }
});
// withdraw cash
app.put("/users/:id/withdraw/", (req, res) => {
  try {
    const { amount } = req.body;
    const { id } = req.params;
    const users = getData();
    const userIdx = users.findIndex((users) => users.id === Number(id));
    const user = users[userIdx];
    if(amount > user.credit) throw new Error("Dont have enough credit for that amount")
    if (user.credit > 0) {
      user.cash -= amount;
      user.credit -= amount;
      users[userIdx] = user;
      fs.writeFileSync("./app.json", JSON.stringify(users));
      res.status(200).send(user);
    } else {
      throw new Error("User has no credit left");
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
