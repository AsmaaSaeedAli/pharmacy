import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetCorporateForViewDto, CorporatesServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
@Component({
    selector: 'view-corporate-modal',
    templateUrl: './view-corporate-modal.component.html'
})
export class ViewCorporateModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    saving = false;
    item = new GetCorporateForViewDto();
    constructor(
        injector: Injector, private _corporatesServiceProxy: CorporatesServiceProxy) {
        super(injector);
    }
    show(id: number): void {
        this._corporatesServiceProxy.getCorporateForView(id).subscribe(item => {
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