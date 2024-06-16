document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get(["ocrResult", "imageUrl"], (result) => {
    const ocrTable = result.ocrResult;
    const imageUrl = result.imageUrl;
    if (imageUrl) {
      document.getElementById("image").src = imageUrl;
    }
    if (ocrTable) {
      const parsedTable = parseOcrResult(ocrTable);
      renderTable(parsedTable);
    } else {
      document.getElementById("resultTable").textContent =
        "No OCR result found.";
    }
  });

  document
    .getElementById("copyButton")
    .addEventListener("click", copyTableToClipboard);
});

function parseOcrResult(ocrResult) {
  const rows = ocrResult.trim().split("\t\r\n");
  return rows.map((row) => row.split("\t"));
}

function renderTable(data) {
  const table = document.getElementById("resultTable");
  table.innerHTML = "";
  const tbody = document.createElement("tbody");

  data.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");
    row.forEach((cell, cellIndex) => {
      const cellElement =
        rowIndex === 0
          ? document.createElement("th")
          : document.createElement("td");
      cellElement.textContent = cell;
      tr.appendChild(cellElement);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
}

function copyTableToClipboard() {
  const table = document.getElementById("resultTable");
  let range, selection;

  if (document.createRange && window.getSelection) {
    range = document.createRange();
    selection = window.getSelection();
    selection.removeAllRanges();
    try {
      range.selectNodeContents(table);
      selection.addRange(range);
    } catch (e) {
      range.selectNode(table);
      selection.addRange(range);
    }
    document.execCommand("copy");
    selection.removeAllRanges();
    alert("Table copied to clipboard!");
  } else {
    alert("Your browser does not support copying.");
  }
}
