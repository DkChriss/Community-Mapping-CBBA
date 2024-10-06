import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentRoutingModule } from './components.routing.module';
import { FireMapComponent } from './fire-map/fire-map.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,ComponentRoutingModule,SharedModule
  ],
  declarations: [FireMapComponent],

  exports:[
    FireMapComponent
  ]

})
export class ComponentsModule { }
