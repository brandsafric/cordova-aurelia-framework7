import { inject, ObserverLocator } from "aurelia-framework";
import { Router } from "aurelia-router";
import {Framework7} from "framework7";

@inject(
  Router,
  ObserverLocator,
  "F7"
)
export class HomePage {
  f7: Framework7;
  title: string;
  router: any;
  controller: any;
  estimate: any;

  constructor(router, storage, controllerFactory, validator, ol, F7) {
    this.f7 = F7;
    this.title = "Home";
    this.router = router;
  }
}
