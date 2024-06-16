chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "extractTables",
    title: "Extract tables from image",
    contexts: ["image"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "extractTables") {
    extractTextFromImage(info.srcUrl, (parsedTable) => {
      chrome.storage.local.set(
        { ocrResult: parsedTable, imageUrl: info.srcUrl },
        () => {
          chrome.windows.create({
            url: "popup.html",
            type: "popup",
            width: 800,
            height: 600,
          });
        }
      );
    });
  }
});

function extractTextFromImage(imageUrl, callback) {
  const ocrApiKey = "K81315300888957";
  const formData = new FormData();
  formData.append("url", imageUrl);
  formData.append("isTable", "true"); // Specify table extraction
  formData.append("apikey", ocrApiKey);

  fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.OCRExitCode === 1) {
        const parsedText = data.ParsedResults[0].ParsedText;
        callback(parsedText);
      } else {
        console.error("Error:", data.ErrorMessage);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
