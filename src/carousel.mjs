// A value picker that cycles through its options: the mouse wheel, the ‹ › steps or the arrow keys move to the
// previous / next option (wrapping around), a click on the value opens the whole list as a dropdown.
// Options: { value, label, short (shown in the carousel, defaults to label), hint, group, classes }.

const WHEEL_STEP = 40; // pixels of trackpad travel per option
let _openPopup = null;

function _closePopup() {
  if (!_openPopup) return;
  const { popup, owner } = _openPopup;
  _openPopup = null;
  popup.remove();
  owner.classList.remove('open');
  document.removeEventListener('pointerdown', _onOutside, true);
  window.removeEventListener('resize', _closePopup);
  window.removeEventListener('scroll', _onScroll, true);
}

function _onOutside(event) {
  if (_openPopup && !_openPopup.popup.contains(event.target) && !_openPopup.owner.contains(event.target)) _closePopup();
}

function _onScroll(event) {
  if (_openPopup && !_openPopup.popup.contains(event.target)) _closePopup();
}

// searchAll: options a typed filter searches (e.g. every mnemonic, while cycling stays within the current ones).
export function Carousel({ options = [], value = null, onChange = () => {}, label = '', searchable = false, searchAll = null, classes = '' }) {
  let _options = options;
  let _value = value ?? (options[0] ? options[0].value : null);
  let _wheel = 0;
  const prev = _button({ class: 'carousel-step', type: 'button', tabindex: '-1', 'aria-label': `Previous ${label}` }, '‹');
  const next = _button({ class: 'carousel-step', type: 'button', tabindex: '-1', 'aria-label': `Next ${label}` }, '›');
  const current = _button({ class: 'carousel-value', type: 'button', 'aria-haspopup': 'listbox',
    title: `${label}: scroll or use the arrow keys to cycle, click for the list` }, '');
  const root = _div({ class: `carousel ${classes}`.trim(), role: 'group', 'aria-label': label }, [prev, current, next]);

  const index = () => _options.findIndex((o) => o.value === _value);

  function _render() {
    const option = _options[index()];
    current.replaceChildren(option ? option.short ?? option.label : '—');
    current.className = 'carousel-value' + (option && option.classes ? ` ${option.classes}` : '');
    const disabled = _options.length < 2;
    prev.disabled = disabled;
    next.disabled = disabled;
  }

  function _set(newValue) {
    if (newValue === _value) return;
    _value = newValue;
    _render();
    onChange(_value);
  }

  function _step(delta) {
    if (!_options.length) return;
    const i = index();
    const n = _options.length;
    _set(_options[((i < 0 ? 0 : i + delta) % n + n) % n].value);
  }

  function _open() {
    if (_openPopup && _openPopup.owner === root) {
      _closePopup();
      return;
    }
    _closePopup();
    const list = _div({ class: 'carousel-list', role: 'listbox', 'aria-label': label }, '');
    const filter = searchable ? _input({ class: 'carousel-filter', type: 'search', placeholder: `Filter ${label}…`, 'aria-label': `Filter ${label}` }) : null;
    const popup = _div({ class: 'carousel-popup' }, filter ? [filter, list] : [list]);
    let items = [];
    let active = 0;

    const highlight = (i) => {
      if (!items.length) return;
      active = (i + items.length) % items.length;
      items.forEach((item, k) => item.el.classList.toggle('active', k === active));
      items[active].el.scrollIntoView({ block: 'nearest' });
    };
    const choose = (option) => {
      _closePopup();
      _set(option.value);
      current.focus();
    };
    const fill = () => {
      const query = filter ? filter.value.trim().toLowerCase() : '';
      const pool = query && searchAll ? searchAll() : _options;
      // With a query: exact names first, then names starting with it, then names / hints containing it.
      const score = (o) => {
        const name = String(o.label).toLowerCase();
        if (name === query) return 0;
        if (name.startsWith(query)) return 1;
        if (name.includes(query)) return 2;
        return `${o.hint || ''} ${o.group || ''}`.toLowerCase().includes(query) ? 3 : -1;
      };
      const shown = query
        ? pool.map((o) => ({ o, rank: score(o) })).filter(({ rank }) => rank >= 0).sort((a, b) => a.rank - b.rank).map(({ o }) => o)
        : pool;
      const children = [];
      items = [];
      let group = null;
      for (const option of shown) {
        if (!query && option.group && option.group !== group) {
          group = option.group;
          children.push(_div({ class: 'carousel-group' }, group));
        }
        const el = _div({ class: 'carousel-option' + (option.value === _value ? ' selected' : '') + (option.classes ? ` ${option.classes}` : ''),
          role: 'option', 'aria-selected': String(option.value === _value) },
          [_span({ class: 'carousel-option-label' }, option.label),
            ...(option.hint || (query && option.group) ? [_span({ class: 'carousel-option-hint' }, [option.hint || '', query && option.group ? `  ${option.group}` : ''].join(''))] : [])]);
        el.addEventListener('pointerdown', (event) => event.preventDefault());
        el.addEventListener('click', () => choose(option));
        items.push({ el, option });
        children.push(el);
      }
      if (!children.length) children.push(_div({ class: 'carousel-empty' }, 'No match'));
      list.replaceChildren(...children);
      const selected = items.findIndex((item) => item.option.value === _value);
      highlight(query || selected < 0 ? 0 : selected);
    };
    const onKey = (event) => {
      const keys = {
        ArrowDown: () => highlight(active + 1), ArrowUp: () => highlight(active - 1),
        Enter: () => items[active] && choose(items[active].option), Escape: () => { _closePopup(); current.focus(); },
        Tab: () => _closePopup(),
      };
      if (!keys[event.key]) return;
      if (event.key !== 'Tab') event.preventDefault();
      keys[event.key]();
    };
    popup.addEventListener('keydown', onKey);
    if (filter) filter.addEventListener('input', fill);
    document.body.append(popup);
    const box = root.getBoundingClientRect();
    popup.style.minWidth = `${Math.max(box.width, 140)}px`;
    popup.style.left = `${Math.min(box.left + window.scrollX, window.scrollX + document.documentElement.clientWidth - popup.offsetWidth - 8)}px`;
    const below = window.innerHeight - box.bottom;
    popup.style.maxHeight = `${Math.max(below, box.top) - 16}px`;
    popup.style.top = below >= Math.min(popup.offsetHeight, 240) || below >= box.top
      ? `${box.bottom + window.scrollY + 2}px`
      : `${box.top + window.scrollY - Math.min(popup.offsetHeight, box.top - 16) - 2}px`;
    root.classList.add('open');
    _openPopup = { popup, owner: root };
    fill();
    popup.tabIndex = -1;
    (filter || popup).focus();
    document.addEventListener('pointerdown', _onOutside, true);
    window.addEventListener('resize', _closePopup);
    window.addEventListener('scroll', _onScroll, true);
  }

  prev.addEventListener('click', () => _step(-1));
  next.addEventListener('click', () => _step(1));
  current.addEventListener('click', _open);
  current.addEventListener('keydown', (event) => {
    const keys = { ArrowUp: -1, ArrowLeft: -1, ArrowDown: 1, ArrowRight: 1 };
    if (keys[event.key] === undefined || event.altKey || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    _step(keys[event.key]);
  });
  root.addEventListener('wheel', (event) => {
    if (_options.length < 2) return;
    event.preventDefault();
    const delta = event.deltaY || event.deltaX;
    // A mouse wheel notch is one option; small trackpad deltas add up to one.
    if (event.deltaMode !== 0 || Math.abs(delta) >= WHEEL_STEP) {
      _wheel = 0;
      _step(Math.sign(delta));
      return;
    }
    _wheel += delta;
    if (Math.abs(_wheel) >= WHEEL_STEP) {
      _step(Math.sign(_wheel));
      _wheel = 0;
    }
  }, { passive: false });

  root.setOptions = ({ options: newOptions = [], value: newValue = _value }) => {
    _options = newOptions;
    _value = newOptions.some((o) => o.value === newValue) ? newValue : newOptions[0] ? newOptions[0].value : null;
    _render();
  };
  // Changes the value without notifying (the caller already knows).
  root.setValue = (newValue) => {
    _value = newValue;
    _render();
  };
  Object.defineProperty(root, 'value', { get: () => _value });
  _render();
  return root;
}
