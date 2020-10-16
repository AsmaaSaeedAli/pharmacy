import { AppComponentBase } from '@shared/common/app-component-base';
import { ManuFactoriesServiceProxy, ManuFactoryDto, CommonLookupServiceProxy, EnumLookupType, NameValueDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ViewChild, Output, EventEmitter, Component, Injector, OnInit, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'createOrEditManuFactoryModal',
    templateUrl: './create-or-edit-manufactory-modal.component.html'
})
export class CreateOrEditManuFactoryModalComponent extends AppComponentBase implements OnInit {
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    manufactory: ManuFactoryDto = new ManuFactoryDto();
    active = false;
    saving = false;
    editFile: boolean = true;
    removeUpload: boolean = false;
    constructor(injector: Injector,
        private _ManuFactoriesServiceProxy: ManuFactoriesServiceProxy) {
        super(injector);
    }
    ngOnInit() {
        
    }


    show(manufactoryId?: number): void {
        if (!manufactoryId) {
            this.manufactory = new ManuFactoryDto();
            this.manufactory.id = manufactoryId;
            this.manufactory.isActive = true;
            this.active = true;
            this.modal.show();
        } else {
            this._ManuFactoriesServiceProxy.getManuFactoryForEdit(manufactoryId).subscribe(result => {
                this.manufactory = result;
                this.active = true;
                this.modal.show();
            });
        }
    }

    

    save(): void {
        this.saving = true;
        this._ManuFactoriesServiceProxy.createOrUpdateManuFactory(this.manufactory)
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
