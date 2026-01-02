"use strict";

// Load items from LocalStorage
let items = JSON.parse(localStorage.getItem("items")) || [];

function saveItems() {
  localStorage.setItem("items", JSON.stringify(items));
}

// Update dashboard stats
function updateStats() {
  const total = document.getElementById("totalCount");
  const lost = document.getElementById("lostCount");
  const found = document.getElementById("foundCount");

  if (total) total.innerText = items.length;
  if (lost) lost.innerText = items.filter(item => item.status === "Lost").length;
  if (found) 
    found.innerText = items.filter(item => item.status === "Found" || item.status === "Claimed").length;
}


// Render table items
function renderItems() {
  const table = document.getElementById("itemTable");
  if (!table) return;

  table.innerHTML = "";

  items.forEach((item, index) => {
    table.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.location}</td>
        <td>${item.status}</td>
        <td>
          <button onclick="markClaimed(${index})">Claim</button>
          <button onclick="deleteItem(${index})">Delete</button>
        </td>
      </tr>
    `;
  });

  updateStats();
}

function searchItems() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const table = document.getElementById("itemTable");
  const rows = table.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    let rowMatches = false;

    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j];

      // Skip cells that contain buttons
      if (cell.querySelector("button")) continue;

      const text = cell.textContent;
      if (text.toLowerCase().includes(input) && input !== "") {
        rowMatches = true;

        // Split text and wrap matches in <mark>
        const regex = new RegExp(`(${input})`, "gi");
        const newHTML = text.replace(regex, `<mark style="background-color:yellow">$1</mark>`);
        cell.innerHTML = newHTML;
      } else if (!cell.querySelector("button")) {
        // Reset cell text if no match
        cell.innerHTML = cell.textContent;
      }
    }

    // Show or hide the row
    rows[i].style.display = rowMatches || input === "" ? "" : "none";
  }
}



// Actions
function markClaimed(index) {
  items[index].status = "Claimed";
  saveItems();
  renderItems();
}

function deleteItem(index) {
  items.splice(index, 1);
  saveItems();
  renderItems();
}

// Handle report form
const form = document.getElementById("reportForm");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const itemName = document.getElementById("itemName").value;
    const location = document.getElementById("location").value;
    const status = document.getElementById("status").value;

    items.push({ name: itemName, location, status });
    saveItems();

    // Notification popup
    const notif = document.createElement("div");
    notif.innerText = "Item reported successfully!";
    notif.style.position = "fixed";
    notif.style.top = "-50px";
    notif.style.right = "20px";
    notif.style.padding = "15px 20px";
    notif.style.backgroundColor = "#2a5298";
    notif.style.color = "white";
    notif.style.borderRadius = "8px";
    notif.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
    notif.style.zIndex = 1000;
    notif.style.transition = "all 0.5s ease";
    document.body.appendChild(notif);

    // Slide down
    setTimeout(() => { notif.style.top = "20px"; }, 50);

    // Remove after 2s
    setTimeout(() => { 
      notif.style.top = "-50px";
      setTimeout(() => notif.remove(), 500);
    }, 2000);

    form.reset();

    // Redirect or render dashboard
    if(window.location.href.includes("index.html")) {
      renderItems();
    } else {
      setTimeout(() => { window.location.href = "index.html"; }, 2000);
    }
  });
}

// Render dashboard on load
renderItems();
