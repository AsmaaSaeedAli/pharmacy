import { AppComponentBase } from '@shared/common/app-component-base';
import { BranchesServiceProxy, BranchDto, CommonLookupServiceProxy, EnumLookupType, NameValueDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ViewChild, Output, EventEmitter, Component, Injector, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'createOrEditBranchModal',
    templateUrl: './create-or-edit-branch-modal.component.html'
})
export class CreateOrEditBranchModalComponent extends AppComponentBase implements OnInit {
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    branch: BranchDto = new BranchDto();
    cities: NameValueDto[] = [];
    branchTypes: NameValueDto[] = [];
    active = false;
    saving = false;

    constructor(injector: Injector,
        private _branchesServiceProxy: BranchesServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy) {
        super(injector);
    }
    ngOnInit() {
        var observableCities = this._commonLookupServiceProxy.getCitiesForComboBox(undefined, undefined);
        var observableBranchTypes =  this._commonLookupServiceProxy.getLookupsByLookupTypeId(EnumLookupType.BranchTypes, undefined);
        forkJoin([observableCities,observableBranchTypes]).subscribe(([cities,branchTypes])=>{
            this.cities = cities;
            this.branchTypes =  branchTypes;
        })
    }

     
    show(branchId?: number): void {
        if (!branchId) {
            this.branch = new BranchDto();
            this.branch.id = branchId;
            this.branch.cityId = null;
            this.branch.branchTypeId = null;
            this.branch.isActive = true;
            this.active = true;
            this.modal.show();
        } else {
            this._branchesServiceProxy.getBranchForEdit(branchId).subscribe(result => {
                this.branch = result;
                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
        this.saving = true;
        this._branchesServiceProxy.createOrUpdateBranch(this.branch)
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
