import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {environment} from "./environments/environment.development";

if (environment.isDemo) {
  console.log('DEMO');
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
