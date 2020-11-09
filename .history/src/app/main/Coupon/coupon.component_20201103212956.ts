import { AppComponentBase } from '@shared/common/app-component-base';
import { ViewEncapsulation, Component, Injector, ViewChild, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { CouponsServiceProxy } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { CouponLoyaltyComponent } from './Coupon-loyalty-modal/Coupon-loyalty-modal.component';
@Component({
    templateUrl: './Coupons.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class CouponsComponent extends AppComponentBase implements AfterViewInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild("CouponLoyalty", { static: true }) CouponLoyalty: CouponLoyaltyComponent;

    filterText = '';
    genderId: undefined;
    nationalityId: undefined;

    constructor(
        injector: Injector,
        private router: Router,
        private route: ActivatedRoute,
        private _CouponsServiceProxy: CouponsServiceProxy,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);

    }
    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    getCoupons(event?: LazyLoadEvent) {
        if (event) {
            if (this.primengTableHelper.shouldResetPaging(event)) {
                this.paginator.changePage(0);
                return;
            }
        }
        this.primengTableHelper.showLoadingIndicator();
        this._CouponsServiceProxy.getAllCoupons(
            this.filterText,
            this.genderId,
            this.nationalityId,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createCoupon() {
        this.router.navigate(['create'], { relativeTo: this.route });
    }

    editCoupon(CouponId){
        this.router.navigate(['edit', CouponId], { relativeTo: this.route });
    }

    viewCoupon(CouponId){
        this.router.navigate(['view', CouponId], { relativeTo: this.route });
    }

    deleteCoupon(employeeId:number): void {
        this.message.confirm('', '',
            (isConfirmed) => {
                if (isConfirmed) {
                    this._CouponsServiceProxy.deleteCoupon(employeeId)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._CouponsServiceProxy.getCouponsToExcel(this.filterText,
            this.genderId,
             this.nationalityId)
            .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
        });
    }

    showLoyaltySales(id){
        this.CouponLoyalty.showCouponLoyalty(id);
    }
}