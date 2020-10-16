import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetItemPriceForViewDto, ItemPricesServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
@Component({
    selector: 'view-item-price-modal',
    templateUrl: './view-item-price-modal.component.html'
})
export class ViewItemPriceModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    saving = false;
    itemprice = new GetItemPriceForViewDto();
    constructor(
        injector: Injector, private _itempricesServiceProxy: ItemPricesServiceProxy) {
        super(injector);
    }
    show(id: number): void {
        this._itempricesServiceProxy.getItemPriceForView(id).subscribe(itemprice => {
            this.itemprice = itemprice;
            this.active = true;
            this.modal.show();
        });
    }
    close(): void {
        this.active = false;
        this.modal.hide();
    }
}