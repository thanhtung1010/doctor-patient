// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appTitle: "Child Care",
  defaultLanguage: "vi",
  API_URL: "https://med-service-demo.herokuapp.com/api/",
  DOMAIN_SHARING: "",
  SVG_HOST: "../assets/svg",
  FORMAT_SETTING: {
    date: "DD/MM/YYYY",
    time: "HH:mm:ss a",
    dateTime: "DD/MM/YYYY HH:mm:ss",
    number: "0,00,###",
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
