import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { RegionListDto, CountriesServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
@Component({
    selector: 'view-region-modal',
    templateUrl: './view-region-modal.component.html'
})
export class ViewRegionModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    saving = false;
    item = new RegionListDto();
    constructor(
        injector: Injector) {
        super(injector);
    }
    show(item: RegionListDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }
    close(): void {
        this.active = false;
        this.modal.hide();
    }
}