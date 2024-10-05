import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentRoutingModule } from './components.routing.module';
import { FireMapComponent } from './fire-map/fire-map.component';

@NgModule({
  imports: [
    CommonModule,ComponentRoutingModule
  ],
  declarations: [FireMapComponent],

  exports:[
    FireMapComponent
  ]

})
export class ComponentsModule { }
