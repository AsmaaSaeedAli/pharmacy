import { AppComponentBase } from '@shared/common/app-component-base';
import { ItemsServiceProxy, ItemDto, CommonLookupServiceProxy, EnumLookupType, NameValueDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ViewChild, Output, EventEmitter, Component, Injector, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { forkJoin } from 'rxjs';
import { ItemBarCodeDto } from '../../../../../shared/service-proxies/service-proxies';

@Component({
    selector: 'item-bar-code',
    templateUrl: './item-bar-code-modal.component.html'
})
export class ItemBarCodeModalComponent extends AppComponentBase {
    @ViewChild('itemBarCodeModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    item: ItemDto = new ItemDto();
    itemBarCode: ItemBarCodeDto = new ItemBarCodeDto();
    active = false;
    saving = false;
    adminBarCode: NameValueDto[] = [];
    pharmacyBarCode: NameValueDto[] = [];
    constructor(injector: Injector,
        private _itemsServiceProxy: ItemsServiceProxy) {
        super(injector);
    }

    show(itemId?: number): void {
        this.adminBarCode = [];
        this.pharmacyBarCode = [];

        this._itemsServiceProxy.getItemForEdit(itemId).subscribe(result => {
            this.item = result;
            if (this.item.barCode)
                this.item.barCode.split(",").forEach((item, index) => {
                    this.adminBarCode.push(new NameValueDto({ value: index.toString(), name: item }))
                });
            else this.adminBarCode.push(new NameValueDto());

            if (this.appSession.tenantId)
                this._itemsServiceProxy.getItemBarCodes(itemId).subscribe(result => {
                    this.itemBarCode = result;
                    if (this.itemBarCode.barCode) {
                        this.itemBarCode.barCode.split(",").forEach((item, index) => {
                            this.pharmacyBarCode.push(new NameValueDto({ value: index.toString(), name: item }))
                        });
                    }
                    else {
                        this.itemBarCode.isActive = true;
                        this.itemBarCode.itemId = itemId;
                        this.pharmacyBarCode.push(new NameValueDto());
                    }
                    this.active = true;
                    this.modal.show();
                });
            else {
                this.active = true;
                this.modal.show();
            }


        });
    }

    save(): void {
        this.saving = true;
        if (this.appSession.tenantId) {
            this.itemBarCode.barCode = this.pharmacyBarCode.map(x => x.name).join();
            this._itemsServiceProxy.saveItemBarCode(this.itemBarCode)
                .pipe(finalize(() => { this.saving = false; }))
                .subscribe(() => {
                    this.notify.info(this.l('SavedSuccessfully'));
                    this.close();
                    this.modalSave.emit(null);
                });
        }
        else {
            this.item.barCode = this.adminBarCode.map(x => x.name).join();
            this._itemsServiceProxy.createOrUpdateItem(this.item)
                .pipe(finalize(() => { this.saving = false; }))
                .subscribe(() => {
                    this.notify.info(this.l('SavedSuccessfully'));
                    this.close();
                    this.modalSave.emit(null);
                });
        }

    }

    close(): void {
        this.adminBarCode = [];
        this.active = false;
        this.modal.hide();
    }

    addNewBarCode() {
        if (this.appSession.tenantId)
            this.pharmacyBarCode.push(new NameValueDto());
        else this.adminBarCode.push(new NameValueDto());
    }

    deleteBarCode(i) {
        this.message.confirm("", "", isConfirmed => {
            if (isConfirmed) {
                if (this.appSession.tenantId)
                    this.pharmacyBarCode.splice(i, 1);
                else
                    this.adminBarCode.splice(i, 1);
            }
        });
    }
}
