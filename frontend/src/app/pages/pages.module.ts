import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { ComponentsModule } from './components/components.module';
import { PagesRoutingModule } from './pages.routing.module';
import { SharedModule } from "./shared/shared.module";

@NgModule({
  imports: [
    CommonModule, ComponentsModule,
    PagesRoutingModule,
    SharedModule
],
  declarations: [PagesComponent]
})
export class PagesModule { }
