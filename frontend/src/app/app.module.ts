import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { provideHttpClient,withFetch } from '@angular/common/http';


@NgModule({
  declarations: [
    
  ],
  imports: [
    BrowserModule,

    
    
    
   
  ],
  providers: [provideHttpClient(withFetch())],
  bootstrap: []
})
export class AppModule { }
