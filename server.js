const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static("public"));

function readData() {
  return JSON.parse(fs.readFileSync("data.json"));
}

function writeData(data) {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

app.get("/goals", (req, res) => {
  res.json(readData().goals);
});

app.post("/goals", (req, res) => {
  const data = readData();
  const goal = {
    id: Date.now(),
    title: req.body.title,
    target: Number(req.body.target),
    progress: 0,
    deadline: req.body.deadline,
    streak: 0,
    lastUpdated: null,
    achieved: false
  };
  data.goals.push(goal);
  writeData(data);
  res.json(goal);
});

app.put("/goals/:id/progress", (req, res) => {
  const data = readData();
  const goal = data.goals.find(g => g.id == req.params.id);
  if (!goal) return res.status(404).json({ message: "Not found" });

  const today = new Date().toDateString();
  if (goal.lastUpdated !== today) {
    goal.streak++;
    goal.lastUpdated = today;
  }

  goal.progress += Number(req.body.amount);
  if (goal.progress >= goal.target) {
    goal.progress = goal.target;
    goal.achieved = true;
  }

  writeData(data);
  res.json(goal);
});

app.delete("/goals/:id", (req, res) => {
  let data = readData();
  data.goals = data.goals.filter(g => g.id != req.params.id);
  writeData(data);
  res.json({ success: true });
});

app.listen(3000, () => console.log("Running on http://localhost:3000"));

