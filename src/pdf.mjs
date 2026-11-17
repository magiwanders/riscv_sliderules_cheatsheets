// PDF of one sheet exactly as it is on screen (filters, chosen instruction, bits), on A4 landscape pages (or A3
// portrait). The sheet is rendered by the browser itself (html-to-image draws it through an SVG foreignObject), then
// cut into pages on the table's grid lines, never through a row. Both libraries come from CDNs and are only loaded on
// the first download.
//
// The page breaks are found in the rendered picture, not in the page's layout: the picture's rows are not quite as
// high as on screen (text is measured differently in an SVG image), so positions taken from the page drift away from
// the rows by a row or more over a long sheet. For the same reason the table is drawn at the height it takes in the
// picture, with room to spare, then cropped: drawn at its height on screen, the last rows would be cut off.

const HTML_TO_IMAGE = 'https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js';
const JSPDF = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
// Page sizes in mm, as jsPDF names them.
export const PAGES = {
  'a4-landscape': { label: 'A4 landscape', format: 'a4', orientation: 'landscape', width: 297, height: 210 },
  'a3-portrait': { label: 'A3 portrait', format: 'a3', orientation: 'portrait', width: 297, height: 420 },
};
const MARGIN_MM = 8;
const MAX_CANVAS_PX = 16000; // browsers refuse larger canvases
const ROOM = { factor: 1.15, px: 200 }; // the table may come out this much higher in the picture than on screen
const STRIP_PX = 256; // pixel rows read at a time when looking for grid lines
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

function _render({ element = null, pixelRatio = 2, height = null }) {
  return window.htmlToImage.toCanvas(element, {
    pixelRatio, backgroundColor: '#ffffff', filter: (node) => !(node.classList && node.classList.contains('no-print')),
    // a taller canvas, the element keeping its own height inside it (html-to-image would stretch it to the canvas)
    ...(height ? { height, style: { height: 'auto' } } : {}),
  });
}

// The lowest pixel row of `canvas` that is not white (-1 when it is all white).
function _contentBottom({ canvas = null }) {
  const context = canvas.getContext('2d');
  for (let y0 = canvas.height; y0 > 0; y0 -= STRIP_PX) {
    const top = Math.max(0, y0 - STRIP_PX);
    const { data } = context.getImageData(0, top, canvas.width, y0 - top);
    for (let y = y0 - top - 1; y >= 0; y--) {
      for (let i = 4 * y * canvas.width; i < 4 * (y + 1) * canvas.width; i += 4) if (data[i] < 245 || data[i + 1] < 245 || data[i + 2] < 245) return top + y;
    }
  }
  return -1;
}

// The share of each pixel row of a canvas `width` wide (RGBA `data`, `rows` high) that is the grid's grey: the table's
// borders are rgb(183, 183, 183), every other grey of the sheets is lighter or darker. Every other pixel is enough.
export function gridShares({ data = [], width = 0, rows = 0 }) {
  const shares = [];
  for (let y = 0; y < rows; y++) {
    let grey = 0;
    let all = 0;
    for (let x = 0; x < width; x += 2) {
      const i = 4 * (y * width + x);
      const high = Math.max(data[i], data[i + 1], data[i + 2]);
      const low = Math.min(data[i], data[i + 1], data[i + 2]);
      all++;
      if (high - low < 24 && high < 215 && low > 120) grey++;
    }
    shares.push(all ? grey / all : 0);
  }
  return shares;
}

// The horizontal grid lines among `shares` (one per pixel row): runs of rows at least half grey, with how good a place
// to end a page each is. 2: the line crosses the whole table (no cell spans across it); 1: a cell spanning rows (a
// group's Type or Ext) interrupts it, the rows themselves are still whole.
export function gridLines({ shares = [] }) {
  const lines = [];
  shares.forEach((share, y) => {
    if (share < 0.5) return;
    const last = lines[lines.length - 1];
    if (last && last.bottom === y - 1) {
      last.bottom = y;
      last.share = Math.max(last.share, share);
    } else lines.push({ top: y, bottom: y, share });
  });
  return lines.map(({ top, bottom, share }) => ({ top, bottom, quality: share >= 0.97 ? 2 : 1 }));
}

// The pages of a sheet `total` pixels high, as [start, end) pixel rows, for pages `pageHeight` high: each page ends
// under the latest grid line of the best quality that fits on it, and the next one starts on that line, so both show
// it. A page with no line that fits (a single row higher than a page) is cut at its full height.
export function pageSlices({ lines = [], total = 0, pageHeight = 0 }) {
  const slices = [];
  let start = 0;
  while (total - start > pageHeight) {
    const fitting = lines.filter((l) => l.top > start && l.bottom + 1 <= start + pageHeight);
    const best = Math.max(0, ...fitting.map((l) => l.quality));
    const line = fitting.filter((l) => l.quality === best).pop();
    if (!line) {
      slices.push([start, start + pageHeight]);
      start += pageHeight;
      continue;
    }
    slices.push([start, line.bottom + 1]);
    start = line.top;
  }
  slices.push([start, total]);
  return slices;
}

// The grid lines of the table drawn on `canvas`, down to pixel row `bottom`.
function _tableLines({ canvas = null, bottom = 0 }) {
  const context = canvas.getContext('2d');
  const shares = [];
  for (let y = 0; y <= bottom; y += STRIP_PX) {
    const rows = Math.min(STRIP_PX, bottom + 1 - y);
    shares.push(...gridShares({ data: context.getImageData(0, y, canvas.width, rows).data, width: canvas.width, rows }));
  }
  return gridLines({ shares });
}

// header: drawn above the sheet; element: the sheet's table (.no-print parts of both are left out); fileName: the
// download; page: a key of PAGES.
export async function downloadPdf({ header = null, element = null, fileName = 'sliderule.pdf', page = 'a4-landscape' }) {
  const size = PAGES[page] || PAGES['a4-landscape'];
  await Promise.all([_load({ src: HTML_TO_IMAGE }), _load({ src: JSPDF })]);
  const room = Math.ceil(element.offsetHeight * ROOM.factor) + ROOM.px;
  const pixelRatio = Math.min(2, MAX_CANVAS_PX / (room + (header ? header.offsetHeight : 0)), MAX_CANVAS_PX / element.offsetWidth);
  const table = await _render({ element, pixelRatio, height: room });
  const tableBottom = _contentBottom({ canvas: table });
  const lines = _tableLines({ canvas: table, bottom: tableBottom });
  const top = header ? await _render({ element: header, pixelRatio }) : null;
  const gap = top ? Math.round(8 * pixelRatio) : 0;
  const tableTop = top ? top.height + gap : 0;
  const sheet = document.createElement('canvas');
  sheet.width = table.width;
  sheet.height = tableTop + tableBottom + 1;
  const draw = sheet.getContext('2d');
  draw.fillStyle = '#ffffff';
  draw.fillRect(0, 0, sheet.width, sheet.height);
  if (top) draw.drawImage(top, 0, 0, Math.min(top.width, sheet.width), top.height, 0, 0, Math.min(top.width, sheet.width), top.height);
  draw.drawImage(table, 0, 0, table.width, tableBottom + 1, 0, tableTop, table.width, tableBottom + 1);
  const pdf = new window.jspdf.jsPDF({ orientation: size.orientation, unit: 'mm', format: size.format });
  const width = size.width - 2 * MARGIN_MM;
  const mmPerPx = width / sheet.width;
  const pageHeight = Math.floor((size.height - 2 * MARGIN_MM) / mmPerPx);
  const slices = pageSlices({ lines: lines.map((l) => ({ ...l, top: l.top + tableTop, bottom: l.bottom + tableTop })), total: sheet.height, pageHeight });
  const slice = document.createElement('canvas');
  slice.width = sheet.width;
  slices.forEach(([start, end], i) => {
    slice.height = end - start;
    const context = slice.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, slice.width, slice.height);
    context.drawImage(sheet, 0, start, sheet.width, slice.height, 0, 0, sheet.width, slice.height);
    if (i > 0) pdf.addPage();
    pdf.addImage(slice.toDataURL('image/png'), 'PNG', MARGIN_MM, MARGIN_MM, width, slice.height * mmPerPx, undefined, 'FAST');
  });
  pdf.save(fileName);
}
