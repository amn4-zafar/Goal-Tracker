const quotes = [
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "We are what we repeatedly do.", author: "Aristotle" },
  { text: "Dreams don’t work unless you do.", author: "John C. Maxwell" }
];

let chart;

function showQuote() {
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById("quote").innerHTML = `"${q.text}" — <b>${q.author}</b>`;
}
showQuote();

async function loadGoals() {
  const res = await fetch("/goals");
  const goals = await res.json();
  const box = document.getElementById("goals");
  box.innerHTML = "";

  goals.forEach(g => {
    const percent = (g.progress / g.target) * 100;
    box.innerHTML += `
      <div class="goal">
        <h3>${g.title}</h3>
        <p>${g.progress}/${g.target} • 🔥 Streak: ${g.streak}</p>
        <p>📅 ${g.deadline}</p>
        <div class="bar"><div class="progress" style="width:${percent}%"></div></div>
        <button onclick="updateGoal(${g.id})">+ Progress</button>
        <button onclick="deleteGoal(${g.id})">Delete</button>
        ${g.achieved ? "<h4>🏆 Achieved!</h4>" : ""}
      </div>
    `;
  });

  renderChart(goals);
}

async function addGoal() {
  const title = document.getElementById("title").value;
  const target = document.getElementById("target").value;
  const deadline = document.getElementById("deadline").value;

  if (!title || !target || !deadline) return alert("Fill all fields");

  await fetch("/goals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, target, deadline })
  });

  document.getElementById("title").value = "";
  document.getElementById("target").value = "";
  document.getElementById("deadline").value = "";

  loadGoals();
}

async function updateGoal(id) {
  await fetch(`/goals/${id}/progress`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: 1 })
  });
  loadGoals();
}

async function deleteGoal(id) {
  await fetch(`/goals/${id}`, { method: "DELETE" });
  loadGoals();
}

function renderChart(goals) {
  const labels = goals.map(g => g.title);
  const data = goals.map(g => Math.round((g.progress / g.target) * 100));
  const colors = labels.map(() => `hsl(${Math.random()*360},70%,60%)`);

  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("progressChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { min: 0, max: 100 } }
    }
  });
}

loadGoals();
