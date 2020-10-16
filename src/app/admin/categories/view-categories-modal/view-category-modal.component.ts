import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { CategoriesListDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
@Component({
    selector: 'view-category-modal',
    templateUrl: './view-category-modal.component.html'
})
export class ViewCategoryModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    saving = false;
    item = new CategoriesListDto();
    constructor(
        injector:Injector) {
        super(injector);
    }

    show(item:CategoriesListDto): void {
            this.item = item;
            this.active = true;
            this.modal.show();
        };
    
    close(): void {
        this.active = false;
        this.modal.hide();
    }
}