document.addEventListener('DOMContentLoaded', function () {
  const pdfContainer = document.getElementById('pdf-container');
  const prevPageBtn = document.getElementById('prev-page');
  const nextPageBtn = document.getElementById('next-page');
  const pageNumSpan = document.getElementById('page-num');
  const goToPageInput = document.getElementById('go-to-page-input');
  const goToPageBtn = document.getElementById('go-to-page-btn');
  const zoomOutBtn = document.getElementById('zoom-out');
  const zoomInBtn = document.getElementById('zoom-in');

  let pdfDoc = null;
  let pageNum = 1;
  let scale = 1.0;

  async function renderPage(num) {
    if (!pdfDoc) return;
    const page = await pdfDoc.getPage(num);
    const viewport = page.getViewport({ scale: scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    pdfContainer.innerHTML = ''; // Clear previous page
    pdfContainer.appendChild(canvas);

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    await page.render(renderContext).promise;

    pageNumSpan.textContent = `Page ${num} of ${pdfDoc.numPages}`;
    goToPageInput.max = pdfDoc.numPages;
  }

  async function loadPDF(url) {
    try {
      const loadingTask = pdfjsLib.getDocument(url);
      pdfDoc = await loadingTask.promise;
      pageNum = 1;
      scale = 1.0;
      renderPage(pageNum);
    } catch (error) {
      pdfContainer.innerHTML = '<p style="color:red;">Failed to load PDF.</p>';
      pageNumSpan.textContent = '';
    }
  }

  prevPageBtn.addEventListener('click', () => {
    if (pageNum <= 1) return;
    pageNum--;
    renderPage(pageNum);
  });

  nextPageBtn.addEventListener('click', () => {
    if (!pdfDoc || pageNum >= pdfDoc.numPages) return;
    pageNum++;
    renderPage(pageNum);
  });

  goToPageBtn.addEventListener('click', () => {
    const targetPage = parseInt(goToPageInput.value);
    if (pdfDoc && targetPage >= 1 && targetPage <= pdfDoc.numPages) {
      pageNum = targetPage;
      renderPage(pageNum);
    }
  });

  zoomOutBtn.addEventListener('click', () => {
    if (scale > 0.25) {
      scale -= 0.25;
      renderPage(pageNum);
    }
  });

  zoomInBtn.addEventListener('click', () => {
    if (scale < 3) {
      scale += 0.25;
      renderPage(pageNum);
    }
  });
  loadPDF('DairyFarm.pdf');
});