import { AppComponentBase } from '@shared/common/app-component-base';
import { ViewEncapsulation, Component, Injector, ViewChild, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {ItemQuantityDto, ItemQuantitiesServiceProxy } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';

import { CreateOrEditItemQuantityModalComponent } from './create-or-edit-item-quantity-modal/create-or-edit-item-quantity-modal.component';

@Component({
    templateUrl: './item-quantities.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ItemQuantitiesComponent extends AppComponentBase implements  AfterViewInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    @ViewChild('createOrEditItemQuantityModal',{static : true}) createOrEditItemQuantityModal: CreateOrEditItemQuantityModalComponent;
    
    filterText = '';
    constructor(
        injector: Injector,
        private _itemquantitiesServiceProxy: ItemQuantitiesServiceProxy,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);

    }
    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    getItemQuantities(event?: LazyLoadEvent) {
        if (event) {
            if (this.primengTableHelper.shouldResetPaging(event)) {
                this.paginator.changePage(0);
                return;
            }
        }
        this.primengTableHelper.showLoadingIndicator();
        this._itemquantitiesServiceProxy.getAllItemQuantities(
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

    createItemQuantity(): void {
        this.createOrEditItemQuantityModal.show();
    }

    deleteItemQuantity(itemquantity: ItemQuantityDto): void {
        this.message.confirm('','',
            (isConfirmed) => {
                if (isConfirmed) {
                    this._itemquantitiesServiceProxy.deleteItemQuantity(itemquantity.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._itemquantitiesServiceProxy.getItemQuantitiesToExcel(this.filterText).subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
        });
    }
}