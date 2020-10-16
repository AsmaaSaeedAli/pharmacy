import { AppComponentBase } from '@shared/common/app-component-base';
import { OnInit, Component, ViewEncapsulation, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { GetCustomerForViewDto, CustomersServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: './view-customer.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ViewCustomerComponent extends AppComponentBase implements OnInit {

    customer = new GetCustomerForViewDto();
    active = false;
    constructor(
        injector: Injector,
        private router: Router,
        private route: ActivatedRoute,
        private _customersServiceProxy: CustomersServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        let customerId = this.route.snapshot.params['customerId'];
        if (customerId)
            this.getCustomerForView(customerId);

    }

    getCustomerForView(customerId) {
        this.primengTableHelper.showLoadingIndicator();
        this._customersServiceProxy.getCustomerForView(customerId).pipe(finalize(() => {
            this.primengTableHelper.hideLoadingIndicator();
        })).subscribe(customer => {
            this.customer = customer;
            this.active = true;
        });
    }

    editCustomer(){
        this.router.navigate(['/app/main/customers/edit', this.customer.id]);
    }

    close() {
        this.router.navigate(['/app/main/customers']);
    }
}