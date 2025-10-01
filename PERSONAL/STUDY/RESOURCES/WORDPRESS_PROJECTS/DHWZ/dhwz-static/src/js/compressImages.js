"use strict";
// window = new BrowserWindow({
//     webPreferences: {
//         nodeIntegration: true,
//         contextIsolation: false
//     }
// });
const {compress_images} = require(['compress-images'])

export default function MyFun() {
  compress_images(
    "src/assets/img/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}",
    "src/assets/build/img/",
    { compress_force: false, statistic: true, autoupdate: true },
    false,
    { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
    { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
    { svg: { engine: "svgo", command: "--multipass" } },
    {
      gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] },
    },
    function (err, completed) {
      if (completed === true) {
        // Doing something.
      }
    }
  );
}

