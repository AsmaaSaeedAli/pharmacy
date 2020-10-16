import { AppComponentBase } from '@shared/common/app-component-base';
import { ViewEncapsulation, Component, Injector, ViewChild, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { CustomersServiceProxy, InvoiceServiceProxy, NameValueDto, CommonLookupServiceProxy, EnumLookupType } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from "moment";
import { InvoiceType } from '../../../../shared/AppEnums';

@Component({
    templateUrl: './invoice-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class InvoiceListComponent extends AppComponentBase implements AfterViewInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    startDate: moment.Moment;
    endDate: moment.Moment;

    filterText = '';
    genderId: undefined;
    nationalityId: undefined;

    invoiceStatues: NameValueDto[] = new Array<NameValueDto>();
    filteredInvoiceStatues: any[] = [];

    invoiceTypes: NameValueDto[] = new Array<NameValueDto>();
    filteredInvoiceTypes: any[] = [];

    constructor(
        injector: Injector,
        private router: Router,
        private route: ActivatedRoute,
        private _invoicesServiceProxy: InvoiceServiceProxy,
        private _fileDownloadService: FileDownloadService,
        private _commonLookupServiceProxy: CommonLookupServiceProxy

    ) {
        super(injector);

    }
    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    filterInvoiceStatues(event) {
        this._commonLookupServiceProxy.getLookupsByLookupTypeId(EnumLookupType.InvoiceStatus, event.query).subscribe(result => {
            this.filteredInvoiceStatues = result;
            this.filteredInvoiceStatues = this.excludeExistItems(this.invoiceStatues, this.filteredInvoiceStatues);
        });
    }

    filterInvoiceTypes(event) {
        this._commonLookupServiceProxy.getLookupsByLookupTypeId(EnumLookupType.InvoiceType, event.query).subscribe(result => {
            this.filteredInvoiceTypes = result;
            this.filteredInvoiceTypes = this.excludeExistItems(this.invoiceTypes, this.filteredInvoiceTypes);
        });
    }

    getInvoices(event?: LazyLoadEvent) {
        if (!this.validateDates()) {
            this.message.error(this.l("InvalidDates"));
            this.addErrorBorderForElementById("StartDatePicker");
            this.addErrorBorderForElementById("EndDatePicker");
            return;
        }

        if (event) {
            if (this.primengTableHelper.shouldResetPaging(event)) {
                this.paginator.changePage(0);
                return;
            }
        }
        this.primengTableHelper.showLoadingIndicator();
        this._invoicesServiceProxy.getAllInvoices(
            this.filterText,
            this.invoiceStatues.map(x => +x.value),
            this.invoiceTypes.map(x => +x.value),
            this.startDate,
            this.endDate,
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

    createInvoice() {
        this.router.navigate(['create'], { relativeTo: this.route });
    }

    editInvoice(invoiceId) {
        //this.router.navigate(['edit', invoiceId], { relativeTo: this.route });
    }

    viewInvoice(invoiceId) {
        //  this.router.navigate(['view', invoiceId], { relativeTo: this.route });
    }

    deleteInvoice(invoiceId: number): void {
        this.message.confirm('', '',
            (isConfirmed) => {
                if (isConfirmed) {

                }
            }
        );
    }

    onChangeStartDate($event) {
        if ($event) {
            this.startDate = moment(this.getDateFromDateTime($event));
        }
    }

    onChangeEndDate($event) {
        if ($event) {
            this.endDate = moment(this.getDateFromDateTime($event));
        }
    }

    resetStartDate() {
        this.startDate = undefined;
        this.resetBorderToDefault("StartDatePicker");
    }

    resetBorderToDefault(id: string) {
        if (document.getElementById(id)) {
            document.getElementById(id).style.border = "gray 1px solid";
        }
    }

    resetEndDate() {
        this.endDate = undefined;
        this.resetBorderToDefault("EndDatePicker");
    }

    validateDates(): boolean {
        if (this.endDate < this.startDate) return false;
        return true;
    }
    addErrorBorderForElementById(id: string) {
        document.getElementById(id).style.border = "red 1px solid";
    }

    resetFilters() {
        this.filterText = "";
        this.invoiceStatues = [];
        this.invoiceTypes = [];
        this.resetStartDate();
        this.resetEndDate();
        this.getInvoices()
    }

}