export class CordovaEvents {
  /**
   *
   */
  constructor() {
    console.log("CordovaEvents instantiated");
  }

  waitForDeviceReady(): Promise<boolean> {
    let p = new Promise<boolean>((resolve, reject) => {
      console.log('waitForDeviceReady promise created');
      document.addEventListener(
        "deviceready",
        () => {
          console.log('deviceready event fired');
          resolve(true);
        },
        false
      );
    });
    return p;
  }
}
