import { AppComponentBase } from '@shared/common/app-component-base';
import { ItemPricesServiceProxy, ItemPriceDto, CommonLookupServiceProxy, EnumLookupType, NameValueDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ViewChild, Output, EventEmitter, Component, Injector, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { forkJoin } from 'rxjs';
import { CreateOrEditItemPriceModalComponent } from './create-or-edit-item-price-modal/create-or-edit-item-price-modal.component';
@Component({
    selector: 'item-price',
    templateUrl: './item-price-modal.component.html'
})
export class ItemPriceModalComponent extends AppComponentBase implements OnInit {
    @ViewChild('itemPriceModal', { static: true }) modal: ModalDirective;
    @ViewChild('createOrEditItemPriceModal',{static : true}) createOrEditItemPriceModal: CreateOrEditItemPriceModalComponent;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    itemprice: any[] = [];
    items: NameValueDto[] = [];
    adminItemPrice: NameValueDto[] = [];
    itemPrices: NameValueDto[] = [];
    itemId;
    active = false;
    saving = false;
    startprodactiondate :Date;
    constructor(injector: Injector,
        private _itempricesServiceProxy: ItemPricesServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy) {
        super(injector);
    }
    ngOnInit() {
        
        var observableItems = this._commonLookupServiceProxy.getItemsForComboBox(undefined);
        forkJoin([observableItems])
            .subscribe(([ items]) => {
               
                this.items = items;
            })

    }


    show(itemId?: number): void {
        this.itemId=itemId;
          this.itemPrices = [];
            this._itempricesServiceProxy.getItemPricesByItemId(itemId).subscribe(result => {
               
                this.itemprice = result.items;
                if(this.itemprice !=null) {
                    
                    this.itemprice.forEach((item, index) => {
                        this.itemPrices.push(new NameValueDto({ value: index.toString(), name: item }))
                    });
                   
                }else{
                    this.itemPrices.push(new NameValueDto());
                }
               
                this.active = true;
                this.modal.show();
            });
        
    }

    createItemPrice(): void {
        this.createOrEditItemPriceModal.showForCreate(this.itemId);
    }

    deleteItemPrice(Id: number): void {
        this.message.confirm('','',
            (isConfirmed) => {
                if (isConfirmed) {
                    this._itempricesServiceProxy.deleteItemPrice(Id)
                        .subscribe(() => {
                            this.close();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }
    close(): void {
        this.itemPrices=[];
        this.active = false;
        this.modal.hide();
    }
    
}
