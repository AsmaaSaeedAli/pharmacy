import { AppComponentBase } from '@shared/common/app-component-base';
import { ItemClassesServiceProxy, ItemClassDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ViewChild, Output, EventEmitter, Component, Injector, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    selector: 'createOrEditItemClassModal',
    templateUrl: './create-or-edit-item-class-modal.component.html'
})
export class CreateOrEditItemClassModalComponent extends AppComponentBase  {
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    itemclass: ItemClassDto = new ItemClassDto();
    active = false;
    saving = false;

    constructor(injector: Injector,
        private _itemclassesServiceProxy: ItemClassesServiceProxy,) {
        super(injector);
    }
    

   
    show(itemclassId?: number): void {
        if (!itemclassId) {
            this.itemclass = new ItemClassDto();
            this.itemclass.id = itemclassId;
            this.itemclass.isActive = true;
            this.active = true;
            this.modal.show();
        } else {
            this._itemclassesServiceProxy.getItemClassForEdit(itemclassId).subscribe(result => {
                this.itemclass = result;
                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
        this.saving = true;
        this._itemclassesServiceProxy.createOrUpdateItemClass(this.itemclass)
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
