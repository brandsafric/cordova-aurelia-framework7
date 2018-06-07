import { CordovaEvents } from './cordova-events';
/// <reference types="aurelia-loader-webpack/src/webpack-hot-interface"/>
// we want font-awesome to load as soon as possible to show the fa-spinner
import {Aurelia} from 'aurelia-framework'
import environment from './environment';
import {PLATFORM} from 'aurelia-pal';
import * as Bluebird from 'bluebird';
import Framework7 from 'framework7';
import VirtualList from 'framework7/dist/components/virtual-list/virtual-list';
import View from 'framework7/dist/components/view/view';
import Panel from 'framework7/dist/components/panel/panel';


// remove out if you don't want a Promise polyfill (remove also from webpack.config.js)
Bluebird.config({ warnings: { wForgottenReturn: false } });

declare const IS_CORDOVA: boolean; // The value is supplied by Webpack during the build

export async function configure(aurelia: Aurelia) {

  if (IS_CORDOVA) {
    console.log('This is a cordova app. Configuring for cordova....');
    const cordova = new CordovaEvents();
    await cordova.waitForDeviceReady();
  }

  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'))
    .plugin(PLATFORM.moduleName('aurelia-validation'));

  // Uncomment the line below to enable animation.
  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-animator-css'));
  // if the css animator is enabled, add swap-order="after" to all router-view elements

  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-html-import-template-loader'));

  if (environment.debug) {
    await aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    await aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  await Framework7.use([
    VirtualList,
    View,
    Panel
  ]);

  await aurelia.container.registerInstance('F7', new Framework7({
    theme: "md",
    init: false
  }));  

  await aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
