import { AppComponentBase } from '@shared/common/app-component-base';
import { CountriesServiceProxy, CountryDto, CommonLookupServiceProxy, EnumLookupType, NameValueDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ViewChild, Output, EventEmitter, Component, Injector, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    selector: 'createOrEditCountryModal',
    templateUrl: './create-or-edit-country-modal.component.html'
})
export class CreateOrEditCountryModalComponent extends AppComponentBase implements OnInit {
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    country: CountryDto = new CountryDto();
    currencies: NameValueDto[] = [];
    active = false;
    saving = false;

    constructor(injector: Injector,
        private _countriesServiceProxy: CountriesServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy) {
        super(injector);
    }
    ngOnInit() {
        this.loadCurrencies();
    }

    loadCurrencies() {
        if (this.currencies.length == 0)
            this._commonLookupServiceProxy.getLookupsByLookupTypeId(EnumLookupType.Currency,undefined).subscribe(result => {
                this.currencies = result;
            })
    }
    show(countryId?: number): void {
        if (!countryId) {
            this.country = new CountryDto();
            this.country.id = countryId;
            this.country.currencyId = null;
            this.country.isActive = true;
            this.active = true;
            this.modal.show();
        } else {
            this._countriesServiceProxy.getCountryForEdit(countryId).subscribe(result => {
                this.country = result;
                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
        this.saving = true;
        this._countriesServiceProxy.createOrUpdateCountry(this.country)
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
