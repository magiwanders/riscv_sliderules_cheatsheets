// One-line embedding:  <script type="module" src="https://sliderules.magiwanders.com/embed.js"></script>
// Mounts the sliderules into the element with id="sliderules" if the page has one, at the end of the page otherwise.
// The stylesheet and the library are loaded from wherever this file is served.
const base = new URL('.', import.meta.url);

const style = document.createElement('link');
style.rel = 'stylesheet';
style.href = new URL('styles.css', base).href;
document.head.append(style);

await import('https://cdn.magiwanders.com/main.js');
const { default: sliderules } = await import(new URL('riscv-sliderules-cheatsheets.js', base).href);

let target = document.getElementById('sliderules');
if (!target) {
  target = document.createElement('div');
  target.id = 'sliderules';
  document.body.append(target);
}
sliderules.loadInto(target.id);
