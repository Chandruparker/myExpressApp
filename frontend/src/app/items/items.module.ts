import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemsRoutingModule } from './items-routing.module';
import { ItemsComponent } from './items.component';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { ViewProductComponent } from '../view-product/view-product.component';


@NgModule({
  imports: [
    CommonModule,
    ItemsRoutingModule,
    ViewProductComponent,  
    EditProductComponent   
  ]
})
export class ItemsModule { }
