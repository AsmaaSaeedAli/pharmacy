import { AppComponentBase } from '@shared/common/app-component-base';
import { ViewEncapsulation, Component, Injector, ViewChild, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {EmployeeDto, EmployeesServiceProxy } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { CreateOrEditEmployeeModalComponent } from './create-or-edit-employee-modal/create-or-edit-employee-modal.component';

@Component({
    templateUrl: './employees.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class EmployeesComponent extends AppComponentBase implements  AfterViewInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    @ViewChild('createOrEditEmployeeModal',{static : true}) createOrEditEmployeeModal: CreateOrEditEmployeeModalComponent;
    
    filterText = '';
    constructor(
        injector: Injector,
        private _employeesServiceProxy: EmployeesServiceProxy,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);

    }
    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    getEmployees(event?: LazyLoadEvent) {
        if (event) {
            if (this.primengTableHelper.shouldResetPaging(event)) {
                this.paginator.changePage(0);
                return;
            }
        }
        this.primengTableHelper.showLoadingIndicator();
        this._employeesServiceProxy.getAllEmployees(
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

    createEmployee(): void {
        this.createOrEditEmployeeModal.show();
    }

    deleteEmployee(employee: EmployeeDto): void {
        this.message.confirm('','',
            (isConfirmed) => {
                if (isConfirmed) {
                    this._employeesServiceProxy.deleteEmployee(employee.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._employeesServiceProxy.getEmployeesToExcel(this.filterText).subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
        });
    }
}