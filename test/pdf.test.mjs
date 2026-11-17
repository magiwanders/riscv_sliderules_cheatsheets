import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gridShares, gridLines, pageSlices } from '../src/pdf.mjs';

// One pixel per row: grey (the grid), a cell colour, white.
const GREY = [183, 183, 183, 255];
const CELL = [244, 204, 204, 255];
const WHITE = [255, 255, 255, 255];
const picture = (rows) => ({ data: rows.flatMap((row) => row.flatMap((p) => p)), width: rows[0].length, rows: rows.length });

test('pdf: the grid grey counts, cell colours and white do not', () => {
  const shares = gridShares(picture([[GREY, GREY, GREY, GREY], [GREY, GREY, CELL, CELL], [CELL, WHITE, CELL, WHITE]]));
  assert.deepEqual(shares, [1, 0.5, 0]);
});

test('pdf: grid lines are runs of grey rows, whole across the table or interrupted by a spanning cell', () => {
  const lines = gridLines({ shares: [1, 1, 0, 0, 0.9, 0.9, 0.2, 0, 1] });
  assert.deepEqual(lines, [{ top: 0, bottom: 1, quality: 2 }, { top: 4, bottom: 5, quality: 1 }, { top: 8, bottom: 8, quality: 2 }]);
});

test('pdf: pages end under the latest whole line that fits, the next starts on it', () => {
  const lines = [{ top: 0, bottom: 1, quality: 2 }, { top: 40, bottom: 41, quality: 2 }, { top: 70, bottom: 71, quality: 1 },
    { top: 90, bottom: 91, quality: 2 }, { top: 150, bottom: 151, quality: 2 }];
  assert.deepEqual(pageSlices({ lines, total: 230, pageHeight: 80 }), [[0, 42], [40, 92], [90, 152], [150, 230]]);
  assert.deepEqual(pageSlices({ lines, total: 160, pageHeight: 80 }), [[0, 42], [40, 92], [90, 160]]);
});

test('pdf: a page without a whole line ends under an interrupted one, or at its full height', () => {
  assert.deepEqual(pageSlices({ lines: [{ top: 30, bottom: 31, quality: 1 }], total: 100, pageHeight: 50 }), [[0, 32], [30, 80], [80, 100]]);
  assert.deepEqual(pageSlices({ lines: [], total: 120, pageHeight: 50 }), [[0, 50], [50, 100], [100, 120]]);
  assert.deepEqual(pageSlices({ lines: [], total: 40, pageHeight: 50 }), [[0, 40]]);
});
