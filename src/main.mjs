import { Sliderule, refresh } from './sliderule.mjs';
import * as line from './line.mjs';

let sliderules = {
  loadInto: (elementID) => {
    document.getElementById(elementID).append(
      Sliderule()
      )
  },
  refresh:refresh,
  // One line of a sheet for other pages: encoderLine, decoderLine, show / hide (a popup), disassemble, assemble.
  line,
};

window.sliderules = sliderules;
export default sliderules;
