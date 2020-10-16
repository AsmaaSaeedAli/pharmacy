import { AppComponentBase } from '@shared/common/app-component-base';
import { ViewEncapsulation, Component, Injector, ViewChild, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {BranchDto, BranchesServiceProxy } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { CreateOrEditBranchModalComponent } from './create-or-edit-branch-modal/create-or-edit-branch-modal.component';

@Component({
    templateUrl: './branches.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class BranchesComponent extends AppComponentBase implements  AfterViewInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    @ViewChild('createOrEditBranchModal',{static : true}) createOrEditBranchModal: CreateOrEditBranchModalComponent;
    
    filterText = '';
    constructor(
        injector: Injector,
        private _branchesServiceProxy: BranchesServiceProxy,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);

    }
    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    getBranches(event?: LazyLoadEvent) {
        if (event) {
            if (this.primengTableHelper.shouldResetPaging(event)) {
                this.paginator.changePage(0);
                return;
            }
        }
        this.primengTableHelper.showLoadingIndicator();
        this._branchesServiceProxy.getAllBranches(
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

    createBranch(): void {
        this.createOrEditBranchModal.show();
    }

    deleteBranch(branch: BranchDto): void {
        this.message.confirm('','',
            (isConfirmed) => {
                if (isConfirmed) {
                    this._branchesServiceProxy.deleteBranch(branch.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._branchesServiceProxy.getBranchesToExcel(this.filterText).subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
        });
    }
}