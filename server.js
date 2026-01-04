const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html for root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

function readData() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")));
}
function writeData(data) {
  fs.writeFileSync(path.join(__dirname, "data.json"), JSON.stringify(data, null, 2));
}

// Get all goals
app.get("/goals", (req, res) => {
  res.json(readData().goals);
});

// Create new goal
app.post("/goals", (req, res) => {
  const data = readData();
  const goal = {
    id: Date.now(),
    title: req.body.title,
    target: req.body.target,
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

// Update progress + streak + achievement
app.put("/goals/:id/progress", (req, res) => {
  const data = readData();
  const goal = data.goals.find(g => g.id == req.params.id);
  if (!goal) return res.status(404).json({ message: "Not found" });

  const today = new Date().toDateString();

  if (goal.lastUpdated !== today) {
    goal.streak += 1;
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

// Delete
app.delete("/goals/:id", (req, res) => {
  let data = readData();
  data.goals = data.goals.filter(g => g.id != req.params.id);
  writeData(data);
  res.json({ success: true });
});

app.listen(3000, () => console.log("Running on http://localhost:3000"));
