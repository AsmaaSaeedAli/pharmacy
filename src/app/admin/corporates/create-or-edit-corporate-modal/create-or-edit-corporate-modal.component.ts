import { AppComponentBase } from '@shared/common/app-component-base';
import { CorporatesServiceProxy, CorporateDto, CommonLookupServiceProxy, EnumLookupType, NameValueDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ViewChild, Output, EventEmitter, Component, Injector, OnInit, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'createOrEditCorporateModal',
    templateUrl: './create-or-edit-corporate-modal.component.html'
})
export class CreateOrEditCorporateModalComponent extends AppComponentBase implements OnInit {
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    corporate: CorporateDto = new CorporateDto();
    cities: NameValueDto[] = [];
    countries: NameValueDto[] = [];
    active = false;
    saving = false;
    editFile: boolean = true;
    removeUpload: boolean = false;
    imageUrl: any="https://image.shutterstock.com/z/stock-vector-creative-pharmacy-concept-logo-design-706262266.jpg" ;
    constructor(injector: Injector,
        private _CorporatesServiceProxy: CorporatesServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy) {
        super(injector);
    }
    ngOnInit() {
        var observableCities = this._commonLookupServiceProxy.getCitiesForComboBox(undefined, undefined);
        var observableCountries = this._commonLookupServiceProxy.getCountriesForComboBox(undefined);
        forkJoin([observableCities, observableCountries]).subscribe(([cities, countries]) => {
            this.cities = cities;
            this.countries = countries;
        })
    }


    show(corporateId?: number): void {
        if (!corporateId) {
            this.corporate = new CorporateDto();
            this.corporate.id = corporateId;
            this.corporate.logo=this.imageUrl;
            this.corporate.cityId = null;
            this.corporate.countryId = null;
            this.corporate.isActive = true;
            this.active = true;
            this.modal.show();
        } else {
            this._CorporatesServiceProxy.getCorporateForEdit(corporateId).subscribe(result => {
                this.corporate = result;
                this.active = true;
                this.modal.show();
            });
        }
    }

    uploadFile(event) {
        let reader = new FileReader(); // HTML5 FileReader API
        let file = event.target.files[0];
        if (event.target.files && event.target.files[0]) {
            reader.readAsDataURL(file);

            // When file uploads set it to file formcontrol
            reader.onload = () => {
              this.imageUrl= reader.result;
              this.corporate.logo =this.imageUrl;
              this.editFile = false;
              this.removeUpload = true;
            }

        }
    }


    save(): void {
        this.saving = true;
        this._CorporatesServiceProxy.createOrUpdateCorporate(this.corporate)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
                this.imageUrl="https://image.shutterstock.com/z/stock-vector-creative-pharmacy-concept-logo-design-706262266.jpg";
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
