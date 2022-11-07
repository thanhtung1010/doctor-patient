import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { registerLicense } from '@syncfusion/ej2-base';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

// Registering Syncfusion license key
registerLicense('ORg4AjUWIQA/Gnt2VVhjQlFaclhJXGJWfFppR2NbfU5xdV9EaVZRTGY/P1ZhSXxRd0VgWX1ddXNXTmhVWEA=');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));