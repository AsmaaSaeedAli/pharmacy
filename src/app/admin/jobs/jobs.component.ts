import { AppComponentBase } from '@shared/common/app-component-base';
import { ViewEncapsulation, Component, Injector, ViewChild, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {JobDto, JobsServiceProxy } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { CreateOrEditJobModalComponent } from './create-or-edit-job-modal/create-or-edit-job-modal.component';

@Component({
    templateUrl: './Jobs.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class JobsComponent extends AppComponentBase implements  AfterViewInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    @ViewChild('createOrEditJobModal',{static : true}) createOrEditJobModal: CreateOrEditJobModalComponent;
    
    filterText = '';
    constructor(
        injector: Injector,
        private _jobsServiceProxy: JobsServiceProxy,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);

    }
    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    getJobs(event?: LazyLoadEvent) {
        if (event) {
            if (this.primengTableHelper.shouldResetPaging(event)) {
                this.paginator.changePage(0);
                return;
            }
        }
        this.primengTableHelper.showLoadingIndicator();
        this._jobsServiceProxy.getAllJobs(
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

    createJob(): void {
        this.createOrEditJobModal.show();
    }

    deleteJob(b: JobDto): void {
        this.message.confirm('','',
            (isConfirmed) => {
                if (isConfirmed) {
                    this._jobsServiceProxy.deleteJob(b.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._jobsServiceProxy.getJobsToExcel(this.filterText).subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
        });
    }
}