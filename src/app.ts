import {PLATFORM} from 'aurelia-pal';
import {RouterConfiguration, Router} from 'aurelia-router';
import {inject} from 'aurelia-framework';
import { Framework7 } from 'Framework7';

@inject('F7')
export class App {
  router: Router;
  f7:Framework7;

  constructor(F7){
    this.f7 = F7;
  }

  configureRouter(config: RouterConfiguration, router: Router, platform): void {
    this.router = router;
        config.map([
            {
                route: ['','home'],
                name: 'Home',
                moduleId: PLATFORM.moduleName('home'),
                nav: true,
                title: 'Home'
            }
        ]);
  }

  attached() {
    this.f7.init();
    const mainView = this.f7.views.create('.view-main');
  }

  go(route){
    this.router.navigate(route);
  }
}
