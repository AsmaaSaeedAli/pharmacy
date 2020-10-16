import { AppComponentBase } from '@shared/common/app-component-base';
import { CategoriesServiceProxy, CategoryDto, NameValueDto, CommonLookupServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ViewChild, Output, EventEmitter, Component, Injector, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'createOrEditCategoryModal',
    templateUrl: './create-or-edit-category-modal.component.html'
})
export class CreateOrEditCategoryModalComponent extends AppComponentBase implements OnInit {
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    category: CategoryDto = new CategoryDto();
    itemClasses: NameValueDto[] = [];
    active = false;
    saving = false;

    constructor(injector: Injector,
        private _categoriesServiceProxy: CategoriesServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy) {
        super(injector);
    }
     ngOnInit() {
        var observableItemCalsses = this._commonLookupServiceProxy.getItemClassesForComboBox(undefined);
        forkJoin([observableItemCalsses]).subscribe(([itemClasses]) => {
            this.itemClasses = itemClasses;

        })
     }

    show(categoryId?: number): void {
        if (!categoryId) {
            this.category = new CategoryDto();
            this.category.id = categoryId;
            this.category.itemClassId = null;
            this.category.isActive = true;
            this.active = true;
            this.modal.show();
        } else {
            this._categoriesServiceProxy.getCategoryForEdit(categoryId).subscribe(result => {
                this.category = result;
                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
        this.saving = true;
        this._categoriesServiceProxy.createOrUpdateCategory(this.category)
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
