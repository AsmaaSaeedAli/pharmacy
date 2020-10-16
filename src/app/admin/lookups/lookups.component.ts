import { Component, Injector, ViewEncapsulation, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LookupsServiceProxy, LookupDto } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { ViewLookupModalComponent } from './view-lookup-modal/view-lookup-modal.component';
import { CreateOrEditLookupModalComponent } from './create-or-edit-lookup-modal/create-or-edit-lookup-modal.component';
@Component({
    templateUrl: './lookups.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class LookupsComponent extends AppComponentBase implements OnInit, AfterViewInit {

    @ViewChild('createOrEditLookupModal', { static: true }) createOrEditLookupModal: CreateOrEditLookupModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    filterText = '';
    lookupTypeId = 0;
    lookupTypes: any[];



    constructor(
        injector: Injector,
        private _lookupsServiceProxy: LookupsServiceProxy,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);

    }
    ngOnInit() {
        this.getAllLookupTypes();
    }
    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }
    getAllLookupTypes() {
        this._lookupsServiceProxy.getAllLookupTypes().subscribe(result => {
            this.lookupTypes = result;
        });
    }

    onChange(typeId) {
        this.lookupTypeId = typeId;
        this.getLookups()
        this.filterText = '';
    }

    getLookups(event?: LazyLoadEvent) {
        if (event) {
            if (this.primengTableHelper.shouldResetPaging(event)) {
                this.paginator.changePage(0);
                return;
            }
        }
        this.primengTableHelper.showLoadingIndicator();
        this._lookupsServiceProxy.getAllLookups(
            this.filterText,
            this.lookupTypeId,
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
        this.getLookups();
    }

    createLookup(): void {
        this.createOrEditLookupModal.show(this.lookupTypeId);
    }

    deleteLookup(lookup: LookupDto): void {
        this.message.confirm('', '',
            (isConfirmed) => {
                if (isConfirmed) {
                    this._lookupsServiceProxy.deleteLookup(lookup.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._lookupsServiceProxy.getLookupsToExcel(this.filterText, this.lookupTypeId).subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
        });
    }
}
