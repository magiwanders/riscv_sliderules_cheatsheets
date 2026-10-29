// PDF of one sheet exactly as it is on screen (filters, chosen instruction, bits), on A3 landscape pages.
// The sheet is rendered by the browser itself (html-to-image draws it through an SVG foreignObject), then cut into
// page-high slices. Both libraries come from CDNs and are only loaded on the first download.

const HTML_TO_IMAGE = 'https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js';
const JSPDF = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
const PAGE_MM = { width: 420, height: 297, margin: 8 };
const MAX_CANVAS_PX = 16000; // browsers refuse larger canvases
const _scripts = {};

function _load({ src = '' }) {
  if (!_scripts[src]) {
    _scripts[src] = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => {
        delete _scripts[src];
        reject(new Error(`could not load ${src}`));
      };
      document.head.append(script);
    });
  }
  return _scripts[src];
}

// element: the sheet (its .no-print parts are left out); fileName: name of the downloaded file.
export async function downloadPdf({ element = null, fileName = 'sliderule.pdf' }) {
  await Promise.all([_load({ src: HTML_TO_IMAGE }), _load({ src: JSPDF })]);
  const pixelRatio = Math.min(2, MAX_CANVAS_PX / element.offsetHeight, MAX_CANVAS_PX / element.offsetWidth);
  const sheet = await window.htmlToImage.toCanvas(element, {
    pixelRatio, backgroundColor: '#ffffff', filter: (node) => !(node.classList && node.classList.contains('no-print')),
  });
  const pdf = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a3' });
  const width = PAGE_MM.width - 2 * PAGE_MM.margin;
  const mmPerPx = width / sheet.width;
  const sliceHeight = Math.floor((PAGE_MM.height - 2 * PAGE_MM.margin) / mmPerPx);
  const slice = document.createElement('canvas');
  slice.width = sheet.width;
  for (let y = 0; y < sheet.height; y += sliceHeight) {
    const height = Math.min(sliceHeight, sheet.height - y);
    slice.height = height;
    const context = slice.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, slice.width, height);
    context.drawImage(sheet, 0, y, sheet.width, height, 0, 0, sheet.width, height);
    if (y > 0) pdf.addPage();
    pdf.addImage(slice.toDataURL('image/png'), 'PNG', PAGE_MM.margin, PAGE_MM.margin, width, height * mmPerPx, undefined, 'FAST');
  }
  pdf.save(fileName);
}
