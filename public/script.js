let apiKey, apiSecret;

function saveKeys() {
  apiKey = document.getElementById("apiKey").value;
  apiSecret = document.getElementById("apiSecret").value;
  localStorage.setItem("bingx_api_key", apiKey);
  localStorage.setItem("bingx_api_secret", apiSecret);
  fetchPnL();
}

async function fetchPnL() {
  const response = await fetch("/api/pnl?apiKey=" + apiKey + "&apiSecret=" + apiSecret);
  const data = await response.json();
  updateTable(data);
  updateSummary(data);
  updateChart(data);
}

function updateTable(data) {
  const table = document.getElementById("pnlTable");
  table.innerHTML = "<tr><th>Datum</th><th>Zisk</th><th>Poplatky</th><th>Výhra</th></tr>";
  data.forEach((row) => {
    const bgClass = row.pnl >= 0 ? "green-bg" : "red-bg";
    table.innerHTML += `<tr class="${bgClass}"><td>${row.date}</td><td>${row.pnl.toFixed(
      2
    )}</td><td>${row.fee.toFixed(2)}</td><td>${row.win ? "✅" : "❌"}</td></tr>`;
  });
}

function updateSummary(data) {
  const pnlMonth = data.reduce((acc, d) => acc + d.pnl, 0);
  const fees = data.reduce((acc, d) => acc + d.fee, 0);
  const last7 = data.slice(-7);
  const avg7 = last7.reduce((a, d) => a + d.pnl, 0) / last7.length;
  const projected = avg7 * 30;
  const winrate = (data.filter((d) => d.win).length / data.length) * 100;

  document.getElementById("summary").innerHTML = `
    <p><strong>Měsíční zisk:</strong> ${pnlMonth.toFixed(2)} USD</p>
    <p><strong>Průměr (7 dní):</strong> ${avg7.toFixed(2)} USD</p>
    <p><strong>Odhad měsíčního zisku:</strong> <span style="color:${
      projected > 0 ? "green" : "red"
    }">${projected.toFixed(2)} USD</span></p>
    <p><strong>Poplatky:</strong> ${fees.toFixed(2)} USD</p>
    <p><strong>Winrate:</strong> ${winrate.toFixed(1)}%</p>
  `;
}

function updateChart(data) {
  const ctx = document.getElementById("pnlChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((d) => d.date),
      datasets: [
        {
          label: "Denní zisk",
          data: data.map((d) => d.pnl),
          borderColor: "blue",
          backgroundColor: "rgba(0,0,255,0.1)",
          tension: 0.3,
          fill: true
        }
      ]
    }
  });
}

setInterval(fetchPnL, 60000);

window.onload = () => {
  apiKey = localStorage.getItem("bingx_api_key");
  apiSecret = localStorage.getItem("bingx_api_secret");
  if (apiKey && apiSecret) fetchPnL();
};