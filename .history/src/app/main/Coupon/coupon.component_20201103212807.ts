import { AppComponentBase } from '@shared/common/app-component-base';
import { ViewEncapsulation, Component, Injector, ViewChild, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { CustomersServiceProxy } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerLoyaltyComponent } from './customer-loyalty-modal/customer-loyalty-modal.component';
@Component({
    templateUrl: './customers.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class CustomersComponent extends AppComponentBase implements AfterViewInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild("customerLoyalty", { static: true }) customerLoyalty: CustomerLoyaltyComponent;

    filterText = '';
    genderId: undefined;
    nationalityId: undefined;

    constructor(
        injector: Injector,
        private router: Router,
        private route: ActivatedRoute,
        private _customersServiceProxy: CustomersServiceProxy,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);

    }
    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    getCustomers(event?: LazyLoadEvent) {
        if (event) {
            if (this.primengTableHelper.shouldResetPaging(event)) {
                this.paginator.changePage(0);
                return;
            }
        }
        this.primengTableHelper.showLoadingIndicator();
        this._customersServiceProxy.getAllCustomers(
            this.filterText,
            this.genderId,
            this.nationalityId,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createCustomer() {
        this.router.navigate(['create'], { relativeTo: this.route });
    }

    editCustomer(customerId){
        this.router.navigate(['edit', customerId], { relativeTo: this.route });
    }

    viewCustomer(customerId){
        this.router.navigate(['view', customerId], { relativeTo: this.route });
    }

    deleteCustomer(employeeId:number): void {
        this.message.confirm('', '',
            (isConfirmed) => {
                if (isConfirmed) {
                    this._customersServiceProxy.deleteCustomer(employeeId)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._customersServiceProxy.getCustomersToExcel(this.filterText,
            this.genderId,
             this.nationalityId)
            .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
        });
    }

    showLoyaltySales(id){
        this.customerLoyalty.showCustomerLoyalty(id);
    }
}