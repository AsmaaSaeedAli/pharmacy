import { AppComponentBase } from '@shared/common/app-component-base';
import { ItemPricesServiceProxy, ItemPriceDto, CommonLookupServiceProxy, EnumLookupType, NameValueDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ViewChild, Output, EventEmitter, Component, Injector, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditItemPriceModal',
    templateUrl: './create-or-edit-item-price-modal.component.html'
})
export class CreateOrEditItemPriceModalComponent extends AppComponentBase implements OnInit {
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    itemprice: ItemPriceDto = new ItemPriceDto();
    items: NameValueDto[] = [];

    active = false;
    saving = false;
    startprodactiondate: Date;
    constructor(injector: Injector,
        private _itempricesServiceProxy: ItemPricesServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy) {
        super(injector);
    }
    ngOnInit() {

        var observableItems = this._commonLookupServiceProxy.getItemsForComboBox(undefined);
        forkJoin([observableItems])
            .subscribe(([items]) => {

                this.items = items;
            })

    }

    showForCreate(itemId?: number): void {
        this.itemprice = new ItemPriceDto();
        this.itemprice.itemId = itemId;
        this.itemprice.isActive = true;
        this.itemprice.dateFrom = moment().startOf('day');
        this.active = true;
        this.modal.show();
    }
    show(itempriceId?: number): void {
        this._itempricesServiceProxy.getItemPriceForEdit(itempriceId).subscribe(result => {
            this.itemprice = result;
            this.active = true;
            this.modal.show();
        });

    }

    save(): void {
        this.saving = true;
        this._itempricesServiceProxy.createOrUpdateItemPrice(this.itemprice)
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
