chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "extractTables",
    title: "Extract tables from image",
    contexts: ["image"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "extractTables") {
    const imageUrl = info.srcUrl;
    fetch(`https://api.ocr.space/parse/imageurl?apikey=K81315300888957&url=${encodeURIComponent(imageUrl)}`)
      .then(response => response.json())
      .then(result => {
        chrome.storage.local.set({ ocrResult: result.ParsedResults[0].ParsedText }, () => {
          chrome.windows.create({
            url: 'popup.html',
            type: 'popup',
            width: 800,
            height: 600
          });
        });
      })
      .catch(error => console.error('OCR error:', error));
  }
});
