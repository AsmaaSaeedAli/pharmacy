import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetSubCategoryForViewDto, SubCategoriesServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
@Component({
    selector: 'view-subcategory-modal',
    templateUrl: './view-subcategory-modal.component.html'
})
export class ViewSubCategoryModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    saving = false;
    item = new GetSubCategoryForViewDto();
    constructor(
        injector: Injector, private _subcategoriesServiceProxy: SubCategoriesServiceProxy) {
        super(injector);
    }
    show(id: number): void {
        this._subcategoriesServiceProxy.getSubCategoryForView(id).subscribe(item => {
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