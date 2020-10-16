import { AppComponentBase } from '@shared/common/app-component-base';
import { EmployeesServiceProxy, EmployeeDto, CommonLookupServiceProxy, EnumLookupType, NameValueDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ViewChild, Output, EventEmitter, Component, Injector, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'createOrEditEmployeeModal',
    templateUrl: './create-or-edit-employee-modal.component.html'
})
export class CreateOrEditEmployeeModalComponent extends AppComponentBase implements OnInit {
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    employee: EmployeeDto = new EmployeeDto();
    branches: NameValueDto[] = [];
    genders: NameValueDto[] = [];
    nationalities: NameValueDto[] = [];
    jobs: NameValueDto[] = [];
    hasUser = false;
    active = false;
    saving = false;

    constructor(injector: Injector,
        private _employeesServiceProxy: EmployeesServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy) {
        super(injector);
    }
    
    ngOnInit() {
        var observableBranches = this._commonLookupServiceProxy.getBranchesForComboBox(undefined);
        var observableGenders =  this._commonLookupServiceProxy.getLookupsByLookupTypeId(EnumLookupType.Gender,undefined);
        var observableNationalities =  this._commonLookupServiceProxy.getNationalitiesForComboBox(undefined);
        var observableJobs =  this._commonLookupServiceProxy.getJobsForComboBox(undefined);
        forkJoin([observableBranches,observableGenders, observableNationalities,observableJobs]).subscribe(([branches,genders,nationalities, jobs])=>{
            this.branches = branches;
            this.genders =  genders;
            this.nationalities = nationalities;
            this.jobs = jobs;
        })
    }

     
    show(employeeId?: number): void {
        if (!employeeId) {
            this.employee = new EmployeeDto();
            this.employee.id = employeeId;
            this.employee.nationalityId = null;
            this.employee.genderId = null;
            this.employee.branchId = null;
            this.employee.jobId = null;
            this.employee.isActive = true;
            this.active = true;
            this.modal.show();
        } else {
            this._employeesServiceProxy.getEmployeeForEdit(employeeId).subscribe(result => {
                this.employee = result;
                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
        this.saving = true;
        this._employeesServiceProxy.createOrUpdateEmployee(this.employee)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
