import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CrudComponent } from './crud/crud.component';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { RoleGuard } from './role.guard';
import { PermissionComponent } from './permission/permission.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { BillingDetailsComponent } from './billing-details/billing-details.component';
import { OrderDetailslsComponent } from './order-detailsls/order-detailsls.component';
import { OrderManagementComponent } from './order-management/order-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

export const routes: Routes = [

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'product', component: CrudComponent, },
  { path: 'add', component: AddProductComponent,canActivate: [RoleGuard],
    data: { role: 'admin' }, },
  { path: 'items/edit/:productId', component: EditProductComponent,canActivate: [RoleGuard],
    data: { role: 'admin' },  },
  { path: 'items/view/:productId', component: ViewProductComponent, },
  { path: 'permission', component: PermissionComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'billing', component: BillingDetailsComponent },
  { path: 'order', component: OrderDetailslsComponent },
  {path:'order-details',component:OrderManagementComponent},
  {path:'users',component:UserManagementComponent},
  {path:'dashboard',component:AdminDashboardComponent},

];
