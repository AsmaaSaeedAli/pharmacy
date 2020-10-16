import { AppComponentBase } from '@shared/common/app-component-base';
import { JobsServiceProxy, JobDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ViewChild, Output, EventEmitter, Component, Injector, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    selector: 'createOrEditJobModal',
    templateUrl: './create-or-edit-job-modal.component.html'
})
export class CreateOrEditJobModalComponent extends AppComponentBase  {
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    job: JobDto = new JobDto();
    active = false;
    saving = false;

    constructor(injector: Injector,
        private _jobsServiceProxy: JobsServiceProxy,) {
        super(injector);
    }
    

   
    show(jobId?: number): void {
        if (!jobId) {
            this.job = new JobDto();
            this.job.id = jobId;
            this.job.isActive = true;
            this.active = true;
            this.modal.show();
        } else {
            this._jobsServiceProxy.getJobForEdit(jobId).subscribe(result => {
                this.job = result;
                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
        this.saving = true;
        this._jobsServiceProxy.createOrUpdateJob(this.job)
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
