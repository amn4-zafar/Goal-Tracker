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
        <p>📅 Deadline: ${g.deadline}</p>
        <div class="bar">
          <div class="progress" style="width:${percent}%"></div>
        </div>
        <button onclick="updateGoal(${g.id})">+ Progress</button>
        <button onclick="deleteGoal(${g.id})">🗑 Delete</button>
        ${g.achieved ? "<h4>🏆 Achieved!</h4>" : ""}
      </div>
    `;
  });
}

async function addGoal() {
  const title = document.getElementById("title").value;
  const target = document.getElementById("target").value;
  const deadline = document.getElementById("deadline").value;

  if (!title || !target || !deadline) {
    alert("Please fill all fields!");
    return;
  }

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
    body: JSON.stringify({ amount: 10 }) // increase by 10 units
  });
  loadGoals();
}

async function deleteGoal(id) {
  if (!confirm("Are you sure you want to delete this goal?")) return;
  await fetch(`/goals/${id}`, { method: "DELETE" });
  loadGoals();
}

// Load goals on page load
loadGoals();
