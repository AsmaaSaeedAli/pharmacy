import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomersComponent } from './customers/customers.component';
import { CreateOrEditCustomerComponent } from './customers/create-or-edit-customer/create-or-edit-customer.component';
import { ViewCustomerComponent } from './customers/view-customer/view-customer.component';
import { CreateOrEditInvoiceComponent } from './invoices/create-or-edit-invoice/create-or-edit-invoice.component';
import { InvoiceListComponent } from './invoices/invoice-list/invoice-list.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'dashboard', component: DashboardComponent, data: { permission: 'Pages.Tenant.Dashboard' } },
                    { path: 'customers', component: CustomersComponent, data: { permission: 'Pages.Administration.Customers' } },
                    { path: 'customers/create', component: CreateOrEditCustomerComponent, data: { permission: 'Pages.Administration.Customers.Manage' } },
                    { path: 'customers/edit/:customerId', component: CreateOrEditCustomerComponent, data: { permission: 'Pages.Administration.Customers.Manage' } },
                    { path: 'customers/view/:customerId', component: ViewCustomerComponent, data: { permission: 'Pages.Administration.Customers' } },
                    { path: 'invoices', component: InvoiceListComponent, data: { permission: 'Pages.Administration.Invoices' } },
                    { path: 'invoices/create', component: CreateOrEditInvoiceComponent, data: { permission: 'Pages.Administration.Invoices' } },
                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MainRoutingModule { }
