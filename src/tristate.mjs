// One switch per instruction bit (31..0) with three states: '-' (x, don't care), '0' or '1'.
// The 1 half sits on top and the 0 half below, so a row of set bits reads like a waveform.
// Click a half to set it, click it again to go back to x. Keyboard: 0 / 1 set and move right,
// x / Delete clear, Backspace clears the bit just typed, arrows / Home / End move: typing a run of 0s and 1s
// fills the following bits one after the other. Pasting a hex word (0x...) or a bit pattern fills the whole row.

// Pasted text as switch states (index 0 = bit 31): a hex word (0x..., 16 bit words leave the upper half x)
// or a bit pattern (0b optional, x or - for don't care, lsb last). null if it is neither.
export function parseBits({ text = '' }) {
  const t = text.trim().toLowerCase().replace(/[_\s]/g, '');
  if (/^0x[0-9a-f]{1,8}$/.test(t)) {
    const word = parseInt(t.slice(2), 16) >>> 0;
    const width = (word & 3) === 3 ? 32 : 16;
    return Array.from({ length: 32 }, (_, i) => (31 - i < width ? String((word >>> (31 - i)) & 1) : '-'));
  }
  if (/^(0b)?[01x-]{1,32}$/.test(t)) return [...t.replace(/^0b/, '').replace(/x/g, '-').padStart(32, '-')];
  return null;
}

export function Tristates({ editable = true, onChange = () => {} }) {
  const switches = [];
  const cells = [];
  for (let bit = 31; bit >= 0; bit--) {
    const one = _button({ class: 'tri-half tri-1', type: 'button', tabindex: '-1', 'aria-label': `inst[${bit}] = 1` }, '1');
    const zero = _button({ class: 'tri-half tri-0', type: 'button', tabindex: '-1', 'aria-label': `inst[${bit}] = 0` }, '0');
    const attributes = { class: 'tri', 'data-state': '-', role: 'group', 'aria-label': `inst[${bit}]` };
    if (editable) {
      attributes.tabindex = bit === 31 ? '0' : '-1';
      attributes.title = `inst[${bit}]: click 1 or 0, click again for x`;
    } else {
      one.disabled = true;
      zero.disabled = true;
    }
    const sw = _div(attributes, [one, zero]);
    if (editable) {
      one.addEventListener('click', () => _toggle({ sw, value: '1' }));
      zero.addEventListener('click', () => _toggle({ sw, value: '0' }));
      sw.addEventListener('keydown', (event) => _onKey({ event, index: switches.indexOf(sw) }));
      sw.addEventListener('paste', _onPaste);
    }
    switches.push(sw);
    cells.push(_th({ class: 'bit-head spine' }, [sw]));
  }

  function _toggle({ sw = null, value = '1' }) {
    sw.dataset.state = sw.dataset.state === value ? '-' : value;
    _focus({ index: switches.indexOf(sw) });
    onChange();
  }

  // Roving tabindex: the row is a single tab stop.
  function _focus({ index = 0 }) {
    const i = Math.max(0, Math.min(31, index));
    switches.forEach((sw, k) => sw.setAttribute('tabindex', k === i ? '0' : '-1'));
    switches[i].focus();
  }

  function _onKey({ event = null, index = 0 }) {
    const set = (value, move, at = index) => {
      switches[at].dataset.state = value;
      onChange();
      _focus({ index: at + move });
    };
    // Like a text cursor: Backspace clears the bit just typed (the one to the left, unless this one is set).
    const back = () => (switches[index].dataset.state !== '-' || index === 0 ? set('-', 0) : set('-', 0, index - 1));
    const keys = {
      0: () => set('0', 1), 1: () => set('1', 1), x: () => set('-', 0), X: () => set('-', 0), Delete: () => set('-', 0),
      Backspace: back, ArrowLeft: () => _focus({ index: index - 1 }), ArrowRight: () => _focus({ index: index + 1 }),
      Home: () => _focus({ index: 0 }), End: () => _focus({ index: 31 }),
    };
    if (!keys[event.key] || event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    keys[event.key]();
  }

  function _onPaste(event) {
    const states = parseBits({ text: (event.clipboardData || window.clipboardData).getData('text') });
    if (!states) return;
    event.preventDefault();
    _apply({ states });
  }

  function _apply({ states = [] }) {
    states.forEach((state, i) => { switches[i].dataset.state = state; });
    onChange();
  }

  return {
    cells,
    // index 0 = bit 31
    read: () => switches.map((sw) => sw.dataset.state),
    // Bits outside the mask (and above a 16 bit width) become x; with off, the upper half of a 16 bit word is greyed out.
    write: ({ value = 0, mask = 0xffffffff, width = 32, off = false }) => {
      switches.forEach((sw, i) => {
        const bit = 31 - i;
        sw.dataset.state = bit < width && (mask >>> bit) & 1 ? String((value >>> bit) & 1) : '-';
        sw.classList.toggle('tri-off', off && bit >= width);
      });
    },
    // Fills the row from pasted text; false if the text is neither a hex word nor a bit pattern.
    paste: ({ text = '' }) => {
      const states = parseBits({ text });
      if (states) _apply({ states });
      return Boolean(states);
    },
    // Marks the bits of an operand (mask over inst[31:0]), e.g. while its token is hovered.
    highlight: ({ mask = 0 }) => switches.forEach((sw, i) => sw.classList.toggle('tri-mark', Boolean((mask >>> (31 - i)) & 1))),
    // Greys out bits 31..16 once the word is known to be a 16 bit instruction.
    dimUpper: ({ dim = false }) => switches.forEach((sw, i) => sw.classList.toggle('tri-off', dim && i < 16)),
  };
}
