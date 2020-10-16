import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ItemsServiceProxy, ItemDto, CommonLookupServiceProxy, EnumLookupType, NameValueDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ViewChild, Output, EventEmitter, Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
@Component({
    templateUrl: './create-or-edit-item-modal.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class CreateOrEditItemModalComponent extends AppComponentBase implements OnInit {
    @ViewChild("itemForm", { static: true }) itemForm: NgForm;
    item: ItemDto = new ItemDto();
    itemClasses: NameValueDto[] = [];
    categories: NameValueDto[] = [];
    markets: NameValueDto[] = [];
    subCategories: NameValueDto[] = [];
    manufactories: NameValueDto[] = [];
    corporates: NameValueDto[] = [];
    active = false;
    saving = false;
    lastCategoryId: number = null;
    constructor(injector: Injector,
        private router: Router,
        private route: ActivatedRoute,
        private _itemsServiceProxy: ItemsServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy) {
        super(injector);
    }
    ngOnInit() {
        let itemId = this.route.snapshot.params['itemId'];
        this.initializeObj();
        if (itemId)
            this.getItemForEdit(itemId);


        var observableCategories = this._commonLookupServiceProxy.getCategoriesForComboBox(undefined);
        var observableItemClasses = this._commonLookupServiceProxy.getItemClassesForComboBox(undefined);
        var observableSubCategories = this._commonLookupServiceProxy.getSubCategoriesForComboBox(undefined);
        var observableMarkets = this._commonLookupServiceProxy.getLookupsByLookupTypeId(EnumLookupType.Markets, undefined);
        var observableManuFactories = this._commonLookupServiceProxy.getManuFactoriesForComboBox(undefined);
        var observableCorporates = this._commonLookupServiceProxy.getCorporatesForComboBox(undefined);
        forkJoin([observableCategories, observableCorporates, observableItemClasses, observableSubCategories, observableMarkets, observableManuFactories])
            .subscribe(([categories, corporates, itemClasses, subCategories, markets, manufactories]) => {
                this.categories = categories;
                this.itemClasses = itemClasses;
                this.corporates = corporates;
                this.subCategories = subCategories;
                this.manufactories = manufactories;
                this.markets = markets;
            })

    }

    initializeObj(){
        this.item = new ItemDto();
        this.item.marketId = null;
        this.item.isInsurance = true;
        this.item.categoryId = this.lastCategoryId;
        this.item.itemClassId = null;
        this.item.subCategoryId = null;
        this.item.manuFactoryId = null;
        this.item.corporateFavoriteId = null;
        this.item.isActive = true;
        this.item.hasVat = true;
        this.item.vat = 15;
        this.active = true;
    }
    getItemForEdit(itemId){
        this.primengTableHelper.showLoadingIndicator();
        this._itemsServiceProxy.getItemForEdit(itemId).pipe(finalize(() => {
            this.primengTableHelper.hideLoadingIndicator();
        })).subscribe(result => {
            this.item = result;
            this.active = true;
        });
    }


    confirmSave() {
        this.message.confirm(
            this.l('SaveItemData'),
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {
                    this.saveItem();
                }
            }
        );
    }

    saveItem(): void {
        this.primengTableHelper.showLoadingIndicator();
        this.saving = true;
        this._itemsServiceProxy.createOrUpdateItem(this.item)
            .pipe(finalize(() => {
                this.saving = false;
                this.primengTableHelper.showLoadingIndicator();
            }))
            .subscribe(result => {
                this.message.success(this.l('SavedSuccessfully'));
                this.close()
            });
    }

    close(): void {
        this.router.navigate(['/app/admin/items']);
    }
    onBeforeSend(event): void {
        event.xhr.setRequestHeader('Authorization', 'Bearer ' + abp.auth.getToken());
    }
}
