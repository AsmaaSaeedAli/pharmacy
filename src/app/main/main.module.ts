import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { CountoModule } from 'angular2-counto';
import { ModalModule, TabsModule, TooltipModule, BsDropdownModule, PopoverModule } from 'ngx-bootstrap';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainRoutingModule } from './main-routing.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FileUploadModule } from 'ng2-file-upload';
import { FileUploadModule as PrimeNgFileUploadModule } from 'primeng/fileupload';

import { BsDatepickerModule, BsDatepickerConfig, BsDaterangepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxBootstrapDatePickerConfigService } from 'assets/ngx-bootstrap/ngx-bootstrap-datepicker-config.service';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CustomersComponent } from './customers/customers.component';
import { CreateOrEditCustomerComponent } from './customers/create-or-edit-customer/create-or-edit-customer.component';
import { ViewCustomerComponent } from './customers/view-customer/view-customer.component';
import { CreateOrEditInvoiceComponent } from './invoices/create-or-edit-invoice/create-or-edit-invoice.component';
import { InvoiceListComponent } from './invoices/invoice-list/invoice-list.component';
import { CustomerLoyaltyComponent } from './customers/customer-loyalty-modal/customer-loyalty-modal.component';
import { AutoCompleteModule } from 'primeng/autocomplete';

NgxBootstrapDatePickerConfigService.registerNgxBootstrapDatePickerLocales();

@NgModule({
    imports: [
        PaginatorModule,
        FileUploadModule,
        PrimeNgFileUploadModule,
        TableModule,
        CommonModule,
        FormsModule,
        ModalModule,
        TabsModule,
        TooltipModule,
        AppCommonModule,
        UtilsModule,
        MainRoutingModule,
        CountoModule,
        NgxChartsModule,
        AutoCompleteModule,
        BsDatepickerModule.forRoot(),
        BsDropdownModule.forRoot(),
        PopoverModule.forRoot()
    ],
    declarations: [
        DashboardComponent,
        CustomersComponent , CreateOrEditCustomerComponent, ViewCustomerComponent,
        InvoiceListComponent, CreateOrEditInvoiceComponent,
        CustomerLoyaltyComponent
       
    ],
    providers: [
        { provide: BsDatepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerConfig },
        { provide: BsDaterangepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDaterangepickerConfig },
        { provide: BsLocaleService, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerLocale }
    ]
})
export class MainModule { }
