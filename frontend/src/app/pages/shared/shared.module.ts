import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponent } from './shared.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SharedComponent, FooterComponent],
  exports:[
    FooterComponent
  ]
})
export class SharedModule { }
