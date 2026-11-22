// A sheet's rows, built as they come near the screen. The rows are given as units (an instruction with its immediate
// row, a decoder group with its members: rows that span each other stay together), each with the number of rows it
// makes. Units are cut into chunks of about CHUNK rows, each its own <tbody>: a chunk starts as one empty row as high as
// its rows will be and is built once it comes within MARGIN of the window; then it stays, so scrolling back costs
// nothing. Short sheets are built at once. x86-64's encoder alone is some 6,000 rows of 100 cells: built at once, the
// browser spends tens of seconds laying them out.

const CHUNK = 48;
const AT_ONCE = 240;
const MARGIN = '1500px 0px';
// the height of a row until one is measured (and the measure for every sheet after)
let _rowHeight = 25;

const _states = new WeakMap();

function _fill({ chunk }) {
  if (chunk.built) return;
  chunk.built = true;
  chunk.body.replaceChildren(...chunk.units.flatMap((unit) => unit.rows()));
  chunk.body.classList.remove('lazy-chunk-pending');
}

// units: [{ count, rows: () => [<tr>, ...] }]. Replaces the table's bodies; returns nothing.
export function lazyRows({ table = null, units = [] }) {
  const previous = _states.get(table);
  if (previous) previous.observer.disconnect();
  for (const body of [...table.tBodies]) body.remove();
  const total = units.reduce((n, unit) => n + unit.count, 0);
  if (total <= AT_ONCE) {
    table.append(_tbody({}, units.flatMap((unit) => unit.rows())));
    _states.delete(table);
    return;
  }
  const columns = table.querySelectorAll(':scope > colgroup > col').length;
  const chunks = [];
  let current = null;
  for (const unit of units) {
    if (!current || current.count >= CHUNK) chunks.push((current = { units: [], count: 0, built: false }));
    current.units.push(unit);
    current.count += unit.count;
  }
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const chunk = chunks.find((c) => c.body === entry.target);
      observer.unobserve(entry.target);
      _fill({ chunk });
    }
  }, { rootMargin: MARGIN });
  for (const chunk of chunks) {
    const spacer = _td({ colspan: String(columns), class: 'lazy-spacer' }, '');
    spacer.style.height = `${chunk.count * _rowHeight}px`;
    chunk.body = _tbody({ class: 'lazy-chunk-pending' }, [_tr({ class: 'lazy-row' }, [spacer])]);
    table.append(chunk.body);
  }
  // the first screenfuls at once: the sheet is never blank, and the rows are measured for the spacers
  _fill({ chunk: chunks[0] });
  if (chunks[1]) _fill({ chunk: chunks[1] });
  const measured = chunks[0].body.getBoundingClientRect().height / chunks[0].count;
  if (measured > 4 && Math.abs(measured - _rowHeight) > 1) {
    _rowHeight = measured;
    for (const chunk of chunks.filter((c) => !c.built)) chunk.body.querySelector('.lazy-spacer').style.height = `${chunk.count * _rowHeight}px`;
  }
  for (const chunk of chunks.filter((c) => !c.built)) observer.observe(chunk.body);
  _states.set(table, { observer, chunks });
}

// Every row of the table built (for a PDF of the whole sheet), a chunk at a time so a spinner can turn meanwhile.
export async function buildAllRows({ table = null, onProgress = () => {} }) {
  const state = _states.get(table);
  if (!state) return;
  const pending = state.chunks.filter((c) => !c.built);
  for (const [i, chunk] of pending.entries()) {
    state.observer.unobserve(chunk.body);
    _fill({ chunk });
    if (i % 20 === 19) {
      onProgress({ done: i + 1, total: pending.length });
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }
}

// The rows built so far (the chunks still empty have none).
export const builtRows = ({ table = null }) => [...table.tBodies].filter((b) => !b.classList.contains('lazy-chunk-pending')).flatMap((b) => [...b.rows]);
