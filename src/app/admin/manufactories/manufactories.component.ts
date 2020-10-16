import { AppComponentBase } from '@shared/common/app-component-base';
import { ViewEncapsulation, Component, Injector, ViewChild, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {ManuFactoryDto, ManuFactoriesServiceProxy } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { CreateOrEditManuFactoryModalComponent } from './create-or-edit-manufactory-modal/create-or-edit-manufactory-modal.component';

@Component({
    templateUrl: './manufactories.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ManuFactoriesComponent extends AppComponentBase implements  AfterViewInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    @ViewChild('createOrEditManuFactoryModal',{static : true}) createOrEditManuFactoryModal: CreateOrEditManuFactoryModalComponent;
    
    filterText = '';
    constructor(injector: Injector,
        private _manufactoriesServiceProxy: ManuFactoriesServiceProxy,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);

    }
    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    getManuFactories(event?: LazyLoadEvent) {
        if (event) {
            if (this.primengTableHelper.shouldResetPaging(event)) {
                this.paginator.changePage(0);
                return;
            }
        }
        this.primengTableHelper.showLoadingIndicator();
        this._manufactoriesServiceProxy.getAllManuFactories(
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

    createManuFactory(): void {
        this.createOrEditManuFactoryModal.show();
    }

    deleteManuFactory(manufactory: ManuFactoryDto): void {
        this.message.confirm('','',
            (isConfirmed) => {
                if (isConfirmed) {
                    this._manufactoriesServiceProxy.deleteManuFactory(manufactory.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._manufactoriesServiceProxy.getManuFactoriesToExcel(this.filterText).subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
        });
    }
}