import { Component, ViewEncapsulation, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetItemForViewDto, ItemsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    templateUrl: './view-item-modal.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ViewItemModalComponent extends AppComponentBase {
    active = false;
    saving = false;
    item = new GetItemForViewDto();
    constructor(
        injector: Injector,
        private router: Router,
        private route: ActivatedRoute,
        private _itemsServiceProxy: ItemsServiceProxy) {
        super(injector);
    }
    ngOnInit() {
        let itemId = this.route.snapshot.params['itemId'];
        if (itemId)
            this.getItemForView(itemId);

    }

    getItemForView(itemId) {
        this.primengTableHelper.showLoadingIndicator();
        this._itemsServiceProxy.getItemForView(itemId).pipe(finalize(() => {
            this.primengTableHelper.hideLoadingIndicator();
        })).subscribe(Item => {
            this.item = Item;
            this.active = true;
        });
    }

    editItem(){
        this.router.navigate(['/app/admin/items/edit', this.item.id]);
    }

    close() {
        this.router.navigate(['/app/admin/items']);
    }
}