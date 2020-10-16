import { AppComponentBase } from '@shared/common/app-component-base';
import { finalize } from 'rxjs/operators';
import { ViewChild, Output, EventEmitter, Injector, Component } from '@angular/core';
import { RegionDto, NameValueDto, RegionsServiceProxy, CommonLookupServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';
@Component({
    selector: 'createOrEditRegionModal',
    templateUrl: './create-or-edit-region-modal.component.html'
})
export class CreateOrEditRegionModalComponent extends AppComponentBase{
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    region: RegionDto = new RegionDto();
    countries: NameValueDto[] = [];
    active = false;
    saving = false;

    constructor(injector: Injector,
        private _regionsServiceProxy: RegionsServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy) {
        super(injector);
    }
    ngOnInit() {
        this.loadCountries();
    }

    loadCountries() {
        if (this.countries.length == 0)
            this._commonLookupServiceProxy.getCountriesForComboBox(undefined).subscribe(result => {
                this.countries = result;
            })
    }
    show(regionId?: number): void {
        if (!regionId) {
            this.region = new RegionDto();
            this.region.id = regionId;
            this.region.countryId = null;
            this.region.isActive = true;
            this.active = true;
            this.modal.show();
        } else {
            this._regionsServiceProxy.getRegionForEdit(regionId).subscribe(result => {
                this.region = result;
                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
        this.saving = true;
        this._regionsServiceProxy.createOrUpdateRegion(this.region)
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