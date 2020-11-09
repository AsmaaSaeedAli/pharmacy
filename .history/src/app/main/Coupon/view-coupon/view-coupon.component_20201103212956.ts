import { AppComponentBase } from '@shared/common/app-component-base';
import { OnInit, Component, ViewEncapsulation, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { GetCouponForViewDto, CouponsServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: './view-Coupon.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ViewCouponComponent extends AppComponentBase implements OnInit {

    Coupon = new GetCouponForViewDto();
    active = false;
    constructor(
        injector: Injector,
        private router: Router,
        private route: ActivatedRoute,
        private _CouponsServiceProxy: CouponsServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        let CouponId = this.route.snapshot.params['CouponId'];
        if (CouponId)
            this.getCouponForView(CouponId);

    }

    getCouponForView(CouponId) {
        this.primengTableHelper.showLoadingIndicator();
        this._CouponsServiceProxy.getCouponForView(CouponId).pipe(finalize(() => {
            this.primengTableHelper.hideLoadingIndicator();
        })).subscribe(Coupon => {
            this.Coupon = Coupon;
            this.active = true;
        });
    }

    editCoupon(){
        this.router.navigate(['/app/main/Coupons/edit', this.Coupon.id]);
    }

    close() {
        this.router.navigate(['/app/main/Coupons']);
    }
}