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

* `gulp`: run default Gulp task (includes `scripts`, `images`, `styles`, `brsrSnc`, `startWatch`);
* `scripts`, `styles`, `images`, `assets`: build related assets;
* `deploy`: deploy project via **rsync**;
* `build`: build project.
