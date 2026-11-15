// One line of a sheet in any page:  <script type="module" src="https://sliderules.magiwanders.com/line.js"></script>
// Then window.sliderulesLine (also this module's default export) has encoderLine, decoderLine, show, hide, disassemble
// and assemble (see src/line.mjs and the README); a 'sliderules-line' event on window says it is ready.
// The stylesheet and the library are loaded from wherever this file is served.
const base = new URL('.', import.meta.url);

const href = new URL('styles.css', base).href;
if (![...document.styleSheets].some((s) => s.href === href)) {
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = href;
  document.head.append(style);
}

await import('https://cdn.magiwanders.com/main.js');
const { default: sliderules } = await import(new URL('riscv-sliderules-cheatsheets.js', base).href);

window.sliderulesLine = sliderules.line;
window.dispatchEvent(new Event('sliderules-line'));
export default sliderules.line;
