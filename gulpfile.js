import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import { deleteAsync } from 'del';
import * as sass from 'sass';
import browserSync from 'browser-sync';
import gulpSass from 'gulp-sass';
import imagemin, { svgo } from 'gulp-imagemin';
import fileInclude from 'gulp-file-include';
import rev from 'gulp-rev-all';
import revRewrite from 'gulp-rev-rewrite';
import revDel from 'gulp-rev';
import gulpif from 'gulp-if';
import notify from 'gulp-notify';
import readFileSync from 'fs';
import webpackStream from 'webpack-stream';
import plumber from 'gulp-plumber';
import path from 'path';
import gulpZip from 'gulp-zip';

const mainSass = gulpSass(sass);
const rootFolder = path.basename(path.resolve());
browserSync.create();

// paths
const srcFolder = './src';
const buildFolder = './app';
const paths = {
  srcImgSvg: `${srcFolder}/img/svg/**.svg`,
  buildImgSvg: `${buildFolder}/img/svg`,
  srcPartialsSvg: `${srcFolder}/partials/svg/**.svg`,
  buildPartialsSvg: `${srcFolder}/svg`,
  srcImgFolder: `${srcFolder}/img`,
  buildImgFolder: `${buildFolder}/img`,
  srcScss: `${srcFolder}/scss/**/*.scss`,
  buildCssFolder: `${buildFolder}/css`,
  srcFullJs: `${srcFolder}/js/**/*.js`,
  srcMainJs: `${srcFolder}/js/main.js`,
  buildJsFolder: `${buildFolder}/js`,
  srcPartialsFolder: `${srcFolder}/partials`,
  resourcesFolder: `${srcFolder}/resources`,
};

let isProd = false; // dev by default

// clean folders
const clean = (path) => {
  const clean = async () => {
    return deleteAsync([path]);
  };
  return clean;
};

// html
const html = () => {
  return gulp
    .src([`${srcFolder}/*.html`])
    .pipe(
      fileInclude({
        prefix: '@',
        basepath: '@file',
      })
    )
    .pipe(gulp.dest(buildFolder))
    .pipe(browserSync.reload({ stream: true }));
};

// styles
const styles = () => {
  return gulp
    .src(paths.srcScss, { sourcemaps: !isProd })
    .pipe(
      plumber({
        errorHandler: function (err) {
          const errorNotify = notify.onError({
            title: 'SCSS',
            message: 'Error: <%= error.message %>',
          });
          errorNotify(err);
          this.emit('end');
        },
      })
    )
    .pipe(mainSass())
    .pipe(
      autoprefixer({
        cascade: false,
        grid: true,
        overrideBrowserslist: ['last 5 versions'],
      })
    )
    .pipe(
      gulpif(
        isProd,
        cleanCSS({
          level: 2,
        })
      )
    )
    .pipe(gulp.dest(paths.buildCssFolder, { sourcemaps: '.' }))
    .pipe(browserSync.stream());
};

// scripts
const scripts = () => {
  return gulp
    .src(paths.srcMainJs)
    .pipe(
      plumber({
        errorHandler: function (err) {
          const errorNotify = notify.onError({
            title: 'JS',
            message: 'Error: <%= error.message %>',
          });
          errorNotify(err);
          this.emit('end');
        },
      })
    )
    .pipe(
      webpackStream({
        mode: isProd ? 'production' : 'development',
        output: {
          filename: 'main.js',
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        targets: 'defaults',
                      },
                    ],
                  ],
                },
              },
            },
          ],
        },
        devtool: !isProd ? 'source-map' : false,
      })
    )
    .pipe(gulp.dest(paths.buildJsFolder))
    .pipe(browserSync.reload({ stream: true }));
};

// img
const images = () => {
  return gulp
    .src([`${paths.srcImgFolder}/**/**.{jpg,jpeg,png,svg,webp}`], { encoding: false })
    .pipe(gulp.dest(paths.buildImgFolder));
};

// resources
const resources = () => {
  return gulp.src(`${paths.resourcesFolder}/**`, { encoding: false }).pipe(gulp.dest(buildFolder));
};

// optimize svg
const optimizeSvg = (pathSrc, pathBuild) => {
  const optimize = () => {
    return gulp
      .src(pathSrc)
      .pipe(
        imagemin([
          svgo({
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false,
                  },
                },
              },
            ],
          }),
        ])
      )
      .pipe(gulp.dest(pathBuild));
  };

  return optimize;
};

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: `${buildFolder}`,
    },
  });

  gulp.watch(paths.srcScss, styles);
  gulp.watch(paths.srcFullJs, scripts);
  gulp.watch(`${paths.srcPartialsFolder}/**/*.html`, html);
  gulp.watch(`${srcFolder}/*.html`, html);
  gulp.watch(`${paths.resourcesFolder}/**`, resources);
  gulp.watch(`${paths.srcImgFolder}/**/**.{jpg,jpeg,png,svg,webp}`, images);
};

const resetCache = () => {
  return gulp
    .src(`${buildFolder}/**/*.{css,js}`)
    .pipe(rev.revision())
    .pipe(revDel({ deleteOriginal: true }))
    .pipe(gulp.dest(buildFolder))
    .pipe(rev.manifest('rev.json'))
    .pipe(gulp.dest(buildFolder));
};

const rewrite = () => {
  const manifest = readFileSync('app/rev.json');
  gulp
    .src(`${paths.buildCssFolder}/*.css`)
    .pipe(
      revRewrite({
        manifest,
      })
    )
    .pipe(gulp.dest(paths.buildCssFolder));
  return gulp
    .src(`${buildFolder}/**/*.html`)
    .pipe(
      revRewrite({
        manifest,
      })
    )
    .pipe(gulp.dest(buildFolder));
};

const zipFiles = () => {
  deleteAsync.sync([`${buildFolder}/*.zip`]);
  return gulp
    .src(`${buildFolder}/**/*.*`, {})
    .pipe(
      plumber(
        notify.onError({
          title: 'ZIP',
          message: 'Error: <%= error.message %>',
        })
      )
    )
    .pipe(gulpZip(`${rootFolder}.zip`))
    .pipe(gulp.dest(buildFolder));
};

const toProd = (done) => {
  isProd = true;
  done();
};

const dev = gulp.series(clean(buildFolder), gulp.parallel(scripts, styles, html, images, resources), watchFiles);

export const build = gulp.series(toProd, clean(buildFolder), gulp.parallel(scripts, styles, html, images, resources));
export const svgmin = gulp.series(
  gulp.parallel(clean(paths.buildImgSvg), clean(paths.buildPartialsSvg)),
  gulp.parallel(
    optimizeSvg(paths.srcImgSvg, paths.buildImgSvg),
    optimizeSvg(paths.srcPartialsSvg, paths.buildPartialsSvg)
  )
);
export const cache = gulp.series(resetCache, rewrite);
export const zip = zipFiles;

export default dev;
