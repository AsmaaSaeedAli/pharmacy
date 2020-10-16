import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetBranchForViewDto, BranchesServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
@Component({
    selector: 'view-branch-modal',
    templateUrl: './view-branch-modal.component.html'
})
export class ViewBranchModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    saving = false;
    item = new GetBranchForViewDto();
    constructor(
        injector: Injector, private _branchesServiceProxy: BranchesServiceProxy) {
        super(injector);
    }
    show(id: number): void {
        this._branchesServiceProxy.getBranchForView(id).subscribe(item => {
            this.item = item;
            this.active = true;
            this.modal.show();
        });
    }
    close(): void {
        this.active = false;
        this.modal.hide();
    }
}