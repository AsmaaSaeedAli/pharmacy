import { AppComponentBase } from '@shared/common/app-component-base';
import { ViewEncapsulation, Component, Injector, ViewChild, AfterViewInit, Input } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { CustomersServiceProxy } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
@Component({
    selector : 'customer-loyalty',
    templateUrl: './customer-loyalty-modal.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class CustomerLoyaltyComponent extends AppComponentBase implements AfterViewInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('customerLoyaltyModal', { static: true }) modal: ModalDirective;

    @Input() customerId: number
    constructor(
        injector: Injector,
        private router: Router,
        private route: ActivatedRoute,
        private _customerServiceProxy: CustomersServiceProxy) {
        super(injector);

    }
    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    showCustomerLoyalty(id?: number) {
        if(id)
            this.customerId = id;
        this.modal.show();
        this.getCustomerLoyalty();
    }

    getCustomerLoyalty(event?: LazyLoadEvent) {
        if (event) {
            if (this.primengTableHelper.shouldResetPaging(event)) {
                this.paginator.changePage(0);
                return;
            }
        }
        this.primengTableHelper.showLoadingIndicator();
        this._customerServiceProxy.getCustomerLoyalty(
            this.customerId,
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
    close(){
        this.modal.hide();
    }

}