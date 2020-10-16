import { AppComponentBase } from '@shared/common/app-component-base';
import { ItemQuantitiesServiceProxy,ItemPricesServiceProxy,ItemPriceListDto, ItemQuantityDto, CommonLookupServiceProxy, EnumLookupType, NameValueDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ViewChild, Output, EventEmitter, Component, Injector, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'createOrEditItemQuantityModal',
    templateUrl: './create-or-edit-item-quantity-modal.component.html'
})
export class CreateOrEditItemQuantityModalComponent extends AppComponentBase implements OnInit {
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    itemquantity: ItemQuantityDto = new ItemQuantityDto();
    itemprices: NameValueDto[] = [];
    items: NameValueDto[] = [];
    branches: NameValueDto[] = [];
    units:NameValueDto[]=[];
    itemid:Number=0 ;
    active = false;
    saving = false;

    constructor(injector: Injector,
        private _itemquantitiesServiceProxy: ItemQuantitiesServiceProxy,
        private _itempricesServiceProxy: ItemPricesServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy) {
        super(injector);
    }
    ngOnInit() {
        var observableItems = this._commonLookupServiceProxy.getItemsForComboBox(undefined);
        var observableBranches = this._commonLookupServiceProxy.getBranchesForComboBox(undefined);
        var observableUnits = this._commonLookupServiceProxy.getLookupsByLookupTypeId(EnumLookupType.Unit,undefined);
        forkJoin([observableItems, observableBranches,observableUnits])
            .subscribe(([items, branches,units]) => {
                this.items = items;
                this.branches = branches;
                this.units =units;
            })

    }


    show(itemquantityId?: number): void {
        if (!itemquantityId) {
            this.itemquantity = new ItemQuantityDto();
            this.itemquantity.id = itemquantityId;
            this.itemquantity.itemPriceId = null;
            this.itemquantity.branchId = null;
            this.itemquantity.unitId = null;
            this.active = true;
            this.modal.show();
        } else {
            this._itemquantitiesServiceProxy.getItemQuantityForEdit(itemquantityId).subscribe(result => {
                this.itemquantity = result;
                this._itempricesServiceProxy.getItemPriceForEdit(this.itemquantity.itemPriceId).subscribe(resultitemPrice => {
               this.itemid=resultitemPrice.itemId;
                console.log(this.itemid);
                console.log(resultitemPrice.itemId);
               this._commonLookupServiceProxy.getItemspricesbyitemForComboBox( resultitemPrice.itemId).subscribe(resultItemspricesbyitem => {
                this.itemprices= resultItemspricesbyitem;
            });
            });
                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
        this.saving = true;
        this._itemquantitiesServiceProxy.createOrUpdateItemQuantity(this.itemquantity)
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
    changeitems(e) {
        this._commonLookupServiceProxy.getItemspricesbyitemForComboBox(Number(e.target.value)).subscribe(result => {
            this.itemprices= result;
        });
    }

}
