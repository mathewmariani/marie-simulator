import fs from "fs";
import path from "path";
import { globSync } from "glob";

function fs_callback(err: any) {
  if (err) { console.error(err); }
}

const assets_dir = "website/assets/js/";

function _buildWebsite() {
  console.log("Building website...");

  // create website directory for output
  if (!fs.existsSync("website")) {
    fs.mkdirSync("website");
  }
  if (!fs.existsSync("website/assets")) {
    fs.mkdirSync("website/assets");
  }
  if (!fs.existsSync("website/assets/js")) {
    fs.mkdirSync("website/assets/js");
  }
  if (!fs.existsSync("website/assets/js/components")) {
    fs.mkdirSync("website/assets/js/components");
  }
  if (!fs.existsSync("website/assets/js/filters")) {
    fs.mkdirSync("website/assets/js/filters");
  }
  if (!fs.existsSync("website/assets/js/mixins")) {
    fs.mkdirSync("website/assets/js/mixins");
  }

  fs.copyFile("src/index.html", `website/index.html`, fs_callback);
  fs.copyFile("src/index.js", `website/index.js`, fs_callback);

  // glob all .js files
  const js_components_glob = globSync("src/assets/js/components/*.js");
  for (const file of js_components_glob) {
    const name = path.parse(file).name;
    fs.copyFile(file, `${assets_dir}/components/${name}.js`, fs_callback);
  }
  const js_filters_glob = globSync("src/assets/js/filters/*.js");
  for (const file of js_filters_glob) {
    const name = path.parse(file).name;
    fs.copyFile(file, `${assets_dir}/filters/${name}.js`, fs_callback);
  }
  const js_mixins_glob = globSync("src/assets/js/mixins/*.js");
  for (const file of js_mixins_glob) {
    const name = path.parse(file).name;
    fs.copyFile(file, `${assets_dir}/mixins/${name}.js`, fs_callback);
  }
}

// main.js
_buildWebsite();