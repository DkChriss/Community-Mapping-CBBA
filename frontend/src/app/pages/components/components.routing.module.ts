import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FireMapComponent } from './fire-map/fire-map.component';

const routes: Routes = [
    { path: '', component: FireMapComponent },
    { path: 'inicio',component: FireMapComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ComponentRoutingModule { 
  
}