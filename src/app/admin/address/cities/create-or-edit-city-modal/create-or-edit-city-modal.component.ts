import { AppComponentBase } from '@shared/common/app-component-base';
import { CitiesServiceProxy, CityDto, CommonLookupServiceProxy, EnumLookupType, NameValueDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ViewChild, Output, EventEmitter, Component, Injector, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    selector: 'createOrEditCityModal',
    templateUrl: './create-or-edit-city-modal.component.html'
})
export class CreateOrEditCityModalComponent extends AppComponentBase implements OnInit {
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    city: CityDto = new CityDto();
    regions: NameValueDto[] = [];
    active = false;
    saving = false;

    constructor(injector: Injector,
        private _citiesServiceProxy: CitiesServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy) {
        super(injector);
    }
    ngOnInit() {
        this.loadRegions();
    }

    loadRegions() {
        if (this.regions.length == 0)
            this._commonLookupServiceProxy.getRegionsForComboBox(undefined,undefined).subscribe(result => {
                this.regions = result;
            })
    }
    show(cityId?: number): void {
        if (!cityId) {
            this.city = new CityDto();
            this.city.id = cityId;
            this.city.regionId = null;
            this.city.isActive = true;
            this.active = true;
            this.modal.show();
        } else {
            this._citiesServiceProxy.getCityForEdit(cityId).subscribe(result => {
                this.city = result;
                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
        this.saving = true;
        this._citiesServiceProxy.createOrUpdateCity(this.city)
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
