import { NgModule } from '@angular/core';
import { ItemsComponent } from './items.component';
import { RouterModule, Routes } from '@angular/router';
import { ViewProductComponent } from '../view-product/view-product.component';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { RoleGuard } from '../role.guard';

const routes: Routes = [
  { path: 'view', component: ViewProductComponent },
  { path: 'edit', component: EditProductComponent, canActivate: [RoleGuard], data: { role: 'admin' } }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsRoutingModule { }
