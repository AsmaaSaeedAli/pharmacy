import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { LookupsServiceProxy, LookupDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';


@Component({
    selector: 'createOrEditLookupModal',
    templateUrl: './create-or-edit-lookup-modal.component.html'
})
export class CreateOrEditLookupModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal',{static : true}) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    saving = false;
    lookup: LookupDto = new LookupDto();
    lookupsTypesName = '';
    constructor(
        injector: Injector,
        private _lookupsServiceProxy: LookupsServiceProxy
    ) {
        super(injector);
    }

    show(typeId: number , lookupId?: number): void {

        if (!lookupId) {
            this.lookup = new LookupDto();
            this.lookup.id = lookupId;
            this.lookup.lookupTypeId = typeId;
            this.lookupsTypesName = '';
            this.active = true;
            this.modal.show();
        } else {
            this._lookupsServiceProxy.getLookupForEdit(lookupId).subscribe(result => {
                this.lookup = result;
                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;
            this._lookupsServiceProxy.createOrUpdateLookup(this.lookup)
             .pipe(finalize(() => { this.saving = false;}))
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
