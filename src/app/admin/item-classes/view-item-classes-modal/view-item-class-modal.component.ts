import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ItemClassesListDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
@Component({
    selector: 'view-itemclass-modal',
    templateUrl: './view-item-class-modal.component.html'
})
export class ViewItemClassModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    saving = false;
    item = new ItemClassesListDto();
    constructor(
        injector: Injector) {
        super(injector);
    }
    show(item: ItemClassesListDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }
    close(): void {
        this.active = false;
        this.modal.hide();
    }
}