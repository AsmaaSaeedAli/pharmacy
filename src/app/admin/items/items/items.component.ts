import { AppComponentBase } from '@shared/common/app-component-base';
import { ViewEncapsulation, Component, Injector, ViewChild, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ItemDto, ItemsServiceProxy, NameValueDto, CommonLookupServiceProxy } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './items.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ItemsComponent extends AppComponentBase implements AfterViewInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    advancedFiltersAreShown = false;

    classes: NameValueDto[] = new Array<NameValueDto>();
    filteredClasses: any[] = [];

    categories: NameValueDto[] = new Array<NameValueDto>();
    filteredCategories: any[] = [];

    subCategories: NameValueDto[] = new Array<NameValueDto>();
    filteredSubCategories: any[] = [];

    manufactories: NameValueDto[] = new Array<NameValueDto>();
    filteredManuFactories: any[] = [];
    corporateFavorites: NameValueDto[] = new Array<NameValueDto>();
    filteredcorporateFavorites: any[] = [];

    filterText = '';
    startDate: moment.Moment;
    endDate: moment.Moment;
    constructor(
        injector: Injector,
        private router: Router,
        private route: ActivatedRoute,
        private _itemsServiceProxy: ItemsServiceProxy,
        private _fileDownloadService: FileDownloadService,
        private _commonLookupServiceProxy: CommonLookupServiceProxy
    ) {
        super(injector);

    }
    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    filterClasses(event) {
        this._commonLookupServiceProxy.getItemClassesForComboBox(event.query).subscribe(result => {
            this.filteredClasses = result;
            this.filteredClasses = this.excludeExistItems(this.classes, this.filteredClasses);
        });
    }

    filterCategories(event) {
        this._commonLookupServiceProxy.getCategoriesForComboBox(event.query).subscribe(result => {
            this.filteredCategories = result;
            this.filteredCategories = this.excludeExistItems(this.categories, this.filteredCategories);
        });
    }

    filterSubCategories(event) {
        this._commonLookupServiceProxy.getSubCategoriesForComboBox(event.query).subscribe(result => {
            this.filteredSubCategories = result;
            this.filteredSubCategories = this.excludeExistItems(this.subCategories, this.filteredSubCategories);
        });
    }
    filterCorporateFavorites(event) {
        this._commonLookupServiceProxy.getCorporatesForComboBox(event.query).subscribe(result => {
            this.filteredcorporateFavorites = result;
            this.filteredcorporateFavorites = this.excludeExistItems(this.subCategories, this.filteredSubCategories);
        });
    }

    filterManuFactories(event) {
        this._commonLookupServiceProxy.getManuFactoriesForComboBox(event.query).subscribe(result => {
            this.filteredManuFactories = result;
            this.filteredManuFactories = this.excludeExistItems(this.manufactories, this.filteredManuFactories);
        });
    }

    getAllItems(event?: LazyLoadEvent) {
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
        this._itemsServiceProxy.getAllItems(
            this.filterText,
            this.classes.map(x => +x.value),
            this.categories.map(x => +x.value),
            this.subCategories.map(x => +x.value),
            this.startDate,
            this.endDate,
            this.manufactories.map(x => +x.value),
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            
            this.primengTableHelper.records.forEach(item=>{
                if(item.barCode)
                    item.barCode = item.barCode.split(",")[0];
            })
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }


    editItem(itemId){
        this.router.navigate(['edit', itemId], { relativeTo: this.route });
    }

    createItem(): void {
        this.router.navigate(['create'], { relativeTo: this.route });
    }
    viewItem(itemId) {
        this.router.navigate(['view', itemId], { relativeTo: this.route });
    }
    deleteItem(item: ItemDto): void {
        this.message.confirm('', '',
            (isConfirmed) => {
                if (isConfirmed) {
                    this._itemsServiceProxy.deleteItem(item.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        if (!this.validateDates()) {
            this.message.error(this.l("InvalidDates"));
            this.addErrorBorderForElementById("StartDatePicker");
            this.addErrorBorderForElementById("EndDatePicker");
            return;
        }
        
        this._itemsServiceProxy.getItemsToExcel(this.filterText,
            this.classes.map(x => +x.value),
            this.categories.map(x => +x.value),
            this.subCategories.map(x => +x.value),
            this.corporateFavorites.map(x => +x.value),
            this.startDate, this.endDate,
            this.manufactories.map(x => +x.value)).subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
        });
    }
    resetFilters() {
        this.filterText = "";
        this.classes = [];
        this.categories = [];
        this.subCategories = [];
        this.corporateFavorites = [];
        this.resetStartDate();
        this.resetEndDate();
        this.getAllItems()
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
}