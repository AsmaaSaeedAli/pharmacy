import { AppComponentBase } from '@shared/common/app-component-base';
import { SubCategoriesServiceProxy, SubCategoryDto, CommonLookupServiceProxy, NameValueDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ViewChild, Output, EventEmitter, Component, Injector, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'createOrEditSubCategoryModal',
    templateUrl: './create-or-edit-subcategory-modal.component.html'
})
export class CreateOrEditSubCategoryModalComponent extends AppComponentBase implements OnInit {
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    subcategory: SubCategoryDto = new SubCategoryDto();
    categories: NameValueDto[] = [];
    subcategoryTypes: NameValueDto[] = [];
    active = false;
    saving = false;

    constructor(injector: Injector,
        private _subcategoriesServiceProxy: SubCategoriesServiceProxy
        , private _commonLookupServiceProxy: CommonLookupServiceProxy) {
        super(injector);
    }
    ngOnInit() {
        var observableCategories = this._commonLookupServiceProxy.getCategoriesForComboBox(undefined);
        forkJoin([observableCategories]).subscribe(([categories]) => {
            this.categories = categories;

        })
    }


    show(subcategoryId?: number): void {
        if (!subcategoryId) {
            this.subcategory = new SubCategoryDto();
            this.subcategory.id = subcategoryId;
            this.subcategory.categoryId = null;
            this.subcategory.isActive = true;
            this.active = true;
            this.modal.show();
        } else {
            this._subcategoriesServiceProxy.getSubCategoryForEdit(subcategoryId).subscribe(result => {
                this.subcategory = result;
                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
        this.saving = true;
        this._subcategoriesServiceProxy.createOrUpdateSubCategory(this.subcategory)
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
