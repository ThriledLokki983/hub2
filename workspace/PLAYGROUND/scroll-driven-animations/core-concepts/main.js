import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))

// WAAPI ScrollTrigger

// Progress Bar
// const $progressBar = document.querySelector('#progress');

// $progressBar.computedStyleMap.transformOrigin = '0% 50%';
// $progressBar.animate(
//   { transform: ['scaleX(0)', 'scaleX(1)'] },
//   {
//     fill: 'forwards',
//     timeline: new ScrollTimeline({
//       source: document.documentElement,
//     })
//   }
// )

// // Images
// const $images = document.querySelectorAll('.revealing-image');

// $images.forEach(($image) => {
//   $image.animate(
//     [
//       { opacity: 0, clipPath: 'inset(45% 20% 45% 20%)', offset: 0 },
//       { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', offset: 0.5 },
//     ],
//     {
//       fill: 'both',
//       timeline: new ViewTimeline({
//         subject: $image,
//         axis: 'block',
//       }),
//     }
//   )
// });

// With the range
const $li = document.querySelector('li');
// Values in String
const rangeStart = 'entry 0%';
const rangeEnd = 'exit 100%';

// values in Object
const rangeStart1 = { rangeName: 'entry', offset: CSS.percent(0) };
const rangeEnd1 = { rangeName: 'exit', offset: CSS.percent(100) };

const timeline = new ScrollTimeline({
  subject: $li,
  axis: 'block',
});

// Animate in
$li?.animate(
  {
  opacity: [0, 1],
  transform: ['translateY(100px)', 'translateY(0)'],
  },
  {
    fill: 'forwards',
    timeline,
    rangeStart: 'entry 0%',
    rangeEnd: 'exit 100%',
  }
)
