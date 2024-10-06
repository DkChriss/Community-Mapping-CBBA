import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponent } from './shared.component';
import { FooterComponent } from './footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms'; // Importa FormsModule


import { CalendarModule } from 'primeng/calendar';

@NgModule({
  imports: [
    CommonModule,CalendarModule,ReactiveFormsModule,FormsModule, 
  ],
  declarations: [SharedComponent, FooterComponent],
  exports:[
    FooterComponent,CalendarModule,ReactiveFormsModule,FormsModule, 
  ]
})
export class SharedModule { }
