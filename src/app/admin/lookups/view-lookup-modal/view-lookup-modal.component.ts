import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { LookupForViewDto,LookupsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
@Component({
    selector: 'viewLookupModal',
    templateUrl: './view-lookup-modal.component.html'
})
export class ViewLookupModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    item: LookupForViewDto;
    constructor(
        injector: Injector,
        private _lookupsServiceProxy: LookupsServiceProxy
    ) {
        super(injector);
        this.item = new LookupForViewDto();

    }

    show(item: LookupForViewDto): void {

        this._lookupsServiceProxy.getLookupForView(item.id).subscribe(result => {
            this.item = result;
            this.active = true;
            this.modal.show();
        });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
