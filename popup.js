document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get('ocrResult', (result) => {
    const ocrText = result.ocrResult;
    if (ocrText) {
      document.getElementById('table').textContent = ocrText;
    } else {
      document.getElementById('table').textContent = 'No OCR result found.';
    }
  });
});
