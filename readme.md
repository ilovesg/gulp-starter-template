# Starter template

My startup environment for practice in frontend-development. Built with Gulp 4. Based on the [OptimizedHTML 5](https://github.com/agragregra/OptimizedHTML-5).

This template helps to solve the following tasks:

* synchronised browser testing;
* building a project from sources (JS/Pug/SASS);
* code analysis with linters;
* image minification;
* deployment on a remote server.

## How to use

1. Clone template content into the current folder and remove unnecessary files with the following command: `git clone https://github.com/ilovesg/starter-template .; rm -rf trunk readme.md .git docs` or [download it manually](https://github.com/ilovesg/starter-template/archive/refs/heads/main.zip).
2. Install dependencies: `npm i`;
3. Run: `gulp`.

### gulpfile.js options

#### filesWatch

Type: `String`; default: `'html,htm,txt,json,md,woff2'`.

List of file extensions for watching & hard reload.

### Gulp tasks

* `gulp`: run default Gulp task (includes `buildScripts`, `buildStyles`, `buildImages`, `buildHtml`, `brsrSnc`, `startWatch`);
* `buildScripts`, `buildStyles`, `buildImages`, `buildHtml`, `buildAssets`: build related assets;
* `deploy`: deploy project via **rsync**;
* `build`: build project.

## Basic structure

### Scripts

Script sources are located in the **/src/scripts** directory. Modules should be placed in the **/src/scripts/modules** subdirectory and then imported inside the **common.js** file. Source scripts are also minified and placed in the **/src/js/scripts.min.js** file.

### Styles

SASS sources are located in the **/src/styles/** folder. Mixins should be placed in the **/src/styles/_mixins** subdirectory and then may be imported inside the desired file. Compiled and compressed styles will be placed in the **/css/styles.min.css** file.

### HTML

Sources are located in the **/src/pug** folder. Layout templates should be placed in the root of this directory, while page/block templates should be placed in appropriate subdirectories.

### Images

All project images are located in the **/src/images** folder. Images from the **/src/images/src** subfolder will be compressed and placed into the **/src/images/docs** subfolder.

## Included features

* [Bootstrap Reboot](https://getbootstrap.com/docs/5.1/content/reboot/) — element-specific CSS changes.
* [Bootstrap Breakpoints](https://getbootstrap.com/docs/5.1/layout/breakpoints/) — breakpoints mixin (SCSS).
* [Bootstrap Grid](https://getbootstrap.com/docs/5.1/layout/grid/) (optional) — grid mixin (SCSS).
