import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetManuFactoryForViewDto, ManuFactoriesServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
@Component({
    selector: 'view-manufactory-modal',
    templateUrl: './view-manufactory-modal.component.html'
})
export class ViewManuFactoryModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    saving = false;
    item = new GetManuFactoryForViewDto();
    constructor(injector: Injector,
        private _manufactoriesServiceProxy: ManuFactoriesServiceProxy) {
        super(injector);
    }
    
    show(id: number): void {
        this._manufactoriesServiceProxy.getManuFactoryForView(id).subscribe(item => {
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