import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetItemQuantityForViewDto, ItemQuantitiesServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
@Component({
    selector: 'view-item-quantity-modal',
    templateUrl: './view-item-quantity-modal.component.html'
})
export class ViewItemQuantityModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    saving = false;
    itemquantity = new GetItemQuantityForViewDto();
    constructor(
        injector: Injector, private _itemQuantitiesServiceProxy: ItemQuantitiesServiceProxy) {
        super(injector);
    }
    show(id: number): void {
        this._itemQuantitiesServiceProxy.getItemQuantityForView(id).subscribe(itemquantity => {
            this.itemquantity = itemquantity;
            this.active = true;
            this.modal.show();
        });
    }
    close(): void {
        this.active = false;
        this.modal.hide();
    }
}