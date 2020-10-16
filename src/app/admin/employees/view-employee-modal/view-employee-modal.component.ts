import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { EmployeeListDto, CountriesServiceProxy, EmployeesServiceProxy, EmployeeForViewDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
@Component({
    selector: 'view-employee-modal',
    templateUrl: './view-employee-modal.component.html'
})
export class ViewEmployeeModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    saving = false;
    item = new EmployeeForViewDto();
    constructor(
        injector: Injector,
        private _employeeServiceProxy : EmployeesServiceProxy) {
        super(injector);
    }
    show(id : number): void {
        this._employeeServiceProxy.getEmployeeForView(id).subscribe(item=>{
            this.item = item;
            this.active = true;
            this.modal.show();
        })
       
    }
    close(): void {
        this.active = false;
        this.modal.hide();
    }
}