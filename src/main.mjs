import { Sliderule, refresh } from './sliderule.mjs';

let sliderules = {
  loadInto: (elementID) => {
    document.getElementById(elementID).append(
      Sliderule()
      )
  },
  refresh:refresh
};

window.sliderules = sliderules;
export default sliderules;
