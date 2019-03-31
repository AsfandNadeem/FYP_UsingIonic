import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import {Subject} from 'rxjs';
import {Observable} from 'rxjs';
import {HTTP_INTERCEPTORS, HttpClientModule , HttpClient } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {AuthServiceService} from './auth/auth-service.service';
import {IonicStorageModule} from '@ionic/Storage';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthInterceptor} from './auth/auth-interceptor';
import {MatExpansionModule} from '@angular/material';
import {MessageserviceService} from './messageservice.service';

@NgModule({
  declarations: [
      AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
      IonicStorageModule.forRoot(),  HttpClientModule, FormsModule, ReactiveFormsModule, MatExpansionModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy,  useClass: IonicRouteStrategy },
      {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
      AuthServiceService, MessageserviceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
