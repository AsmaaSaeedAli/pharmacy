import { ViewEncapsulation, Component, Injector, ViewChild, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {CountryDto, CountriesServiceProxy } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AppComponentBase } from '@shared/common/app-component-base';
import { RegionsServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditRegionModalComponent } from './create-or-edit-region-modal/create-or-edit-region-modal.component';
@Component({
    templateUrl: './regions.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class RegionsComponent extends AppComponentBase{
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    @ViewChild('createOrEditRegionModal',{static : true}) createOrEditRegionModal: CreateOrEditRegionModalComponent;
    
    filterText = '';
    constructor(
        injector: Injector,
        private _regionsServiceProxy: RegionsServiceProxy,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);

    }
    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    getRegions(event?: LazyLoadEvent) {
        if (event) {
            if (this.primengTableHelper.shouldResetPaging(event)) {
                this.paginator.changePage(0);
                return;
            }
        }
        this.primengTableHelper.showLoadingIndicator();
        this._regionsServiceProxy.getAllRegions(
            this.filterText,
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

    createRegion(): void {
        this.createOrEditRegionModal.show();
    }

    deleteRegion(country: CountryDto): void {
        this.message.confirm('','',
            (isConfirmed) => {
                if (isConfirmed)
                    this._regionsServiceProxy.deleteRegion(country.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
            }
        );
    }

    exportToExcel(): void {
        this._regionsServiceProxy.getRegionsToExcel(this.filterText).subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
        });
    }
}