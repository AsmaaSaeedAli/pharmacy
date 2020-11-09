import { AppComponentBase } from '@shared/common/app-component-base';
import { InvoiceServiceProxy, InvoiceDto, CommonLookupServiceProxy, ItemQuantitiesServiceProxy, CustomersServiceProxy, NameValueDto, CustomerDto, InvoiceItemDto } from '@shared/service-proxies/service-proxies';
import { Component, ViewEncapsulation, Injector, OnInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
import { forkJoin } from 'rxjs';
import { EnumLookupType, ItemsServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { NgForm } from '@angular/forms';
import { inherits } from 'util';
import { InvoiceStatus } from '@shared/AppEnums';
import { InvoiceType } from '../../../../shared/AppEnums';
import { CustomerLoyaltyComponent } from '@app/main/customers/customer-loyalty-modal/customer-loyalty-modal.component';


@Component({
    selector: 'createOrEditInvoice',
    templateUrl: './create-or-edit-invoice.component.html',
    styleUrls: ['./create-or-edit-invoice.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class CreateOrEditInvoiceComponent extends AppComponentBase implements OnInit {
    @ViewChild("invoiceForm", { static: true }) customerForm: NgForm;
    @ViewChild("customerLoyalty", { static: true }) customerLoyalty: CustomerLoyaltyComponent;

    public customer: CustomerDto[];
    invoice = new InvoiceDto();

    active = false;
    saving = false;
    itemSearch: string;
    customerSearch: string;
    uploadUrl: string;
    newInvoiceStatus = InvoiceStatus.New;
    normalInvoiceType = InvoiceType.Normal;
    insuranceInvoiceType = InvoiceType.Insurance;
    customerName: string = '';
    customerId: number
    items: any[] = [];
    item: any[] = [];
    invoiceTypes: NameValueDto[] = [];
    invoiceStatus: NameValueDto[] = [];
    CouponItems: NameValueDto[] = [];
    CouponUserId: number;
    CouponUser: object;
    units: NameValueDto[] = [];
    invoiceItemTemp = new InvoiceItemDto();
    constructor(
        injector: Injector,
        private router: Router,
        private route: ActivatedRoute,
        private _invoicesServiceProxy: InvoiceServiceProxy,
        private _customersServiceProxy: CustomersServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy

    ) {
        super(injector);
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/FileUpload/UploadFileAsync';
    }
    ngOnInit() {
        this.initialization();
    }

    initialization() {
        this.invoice.invoiceItems = [];
        this.invoice.discount = 0;
        this.invoice.netAmount = 0;
        this.invoice.totalAmount = 0;
        this.invoice.statusId = this.newInvoiceStatus;
this.CouponItems=[];//=GetCouponItemsBycode
this.CouponUserId=0;//GetCouponuserByCustomerID


        var observableInvoiceType = this._commonLookupServiceProxy.getLookupsByLookupTypeId(EnumLookupType.InvoiceType,undefined);
        var observableInvoiceStatus = this._commonLookupServiceProxy.getLookupsByLookupTypeId(EnumLookupType.InvoiceStatus,undefined);
        var observableUnit = this._commonLookupServiceProxy.getLookupsByLookupTypeId(EnumLookupType.Unit,undefined);
        forkJoin([observableInvoiceType, observableInvoiceStatus, observableUnit])
            .subscribe(([invoiceTypes, invoiceStatus, units]) => {
                this.invoiceTypes = invoiceTypes;
                this.invoiceStatus = invoiceStatus;
                this.units = units
                this.invoice.invoiceTypeId = this.normalInvoiceType;
            });
    }

    save() {
        this.primengTableHelper.showLoadingIndicator();
        this.saving = true;
        this._invoicesServiceProxy.createInvoice(this.invoice)
            .pipe(finalize(() => {
                this.saving = false;
                this.primengTableHelper.hideLoadingIndicator();
            }))
            .subscribe(result => {
                this.message.success(this.l('SavedSuccessfully'));
                this.close()
            });
    }

    close() {
        this.router.navigate(['/app/main/invoices']);
    }


    getCustomer() {
        if (!this.customerSearch || this.customerSearch.trim() == '') return;
        if (this.customerSearch)
            this.customerSearch = this.customerSearch.trim();
        this._customersServiceProxy.getLiteCustomerData(this.customerSearch).subscribe(result => {
            this.invoice.customerId = result.id;
            this.customerName = result.fullName;
            this.customerId = result.id;

        });
    }

    showLoyaltySales() {
        this.customerLoyalty.showCustomerLoyalty()
    }
    getItem() {
        this.invoiceItemTemp = new InvoiceItemDto();
        this._invoicesServiceProxy.getItemDetails(this.itemSearch,
            this.invoice.invoiceTypeId == this.insuranceInvoiceType).subscribe(result => {
                if (result.itemNameAr != null) {
                    this.itemSearch = '';
                    this.invoiceItemTemp = result;
                    this.invoice.invoiceItems.push(this.invoiceItemTemp)
                }
                else {
                    this.message.info(this.l('NoItemSimilarInput'));
                }
            });
    }
    removeItem(rowIndex) {
        this.message.confirm(this.l('AreYouSureToDeleteItemFromInvoice'), this.l('Delete'),
            (isConfirmed) => {
                if (isConfirmed)
                    this.invoice.invoiceItems.splice(rowIndex, 1);
            })

    }

    onChangeQuantityOrDiscount(rowIndex) {
        let item = this.invoice.invoiceItems[rowIndex];
        item.amount = item.quantity * item.itemPrice;
        let itemWithVat = (item.amount) + (item.amount * item.vat / 100);
        item.netAmount = itemWithVat - (itemWithVat * item.discount / 100);
    }

    get getTotalAmount(): number {
//ifuserhaveacoupon
var value = 0;
// this.CouponUsers.forEach(c=>{
//     if(this.invoice.customerId.toString()!== c.value){
//         this.invoice.invoiceItems.forEach(i => {
//             this.CouponItems.forEach(c => {
//             if(i.itemId.toString()==c.value)
//             value += i.netAmount;
//         });
//     });
//     }

// }
       if(this.CouponUserId==this.invoice.customerId) 
        this.invoice.invoiceItems.forEach(i => {
            if(i.itemId in this.items.find(c=>c.id==i.itemId))
            value += i.netAmount*c.discountrate;
            else
            value += i.netAmount


        });
        else
        {
            this.invoice.invoiceItems.forEach(i => {
                if(i.itemId in this.CouponItems.find(c=>c.id==i.itemId))
               {
                value += i.netAmount*c.discountrate; 
                 this.CouponUser.UsersId=this.invoice.customerId;
        this.CouponUser.CouponId=this.invoice.invoiceItems.CouponId;
               }
        //addcou CouponUser
                else
                value += i.netAmount
    
    
            });
      
        }
        this.invoice.totalAmount = value;
        return this.invoice.totalAmount;
    }
    
    get getNetTotalAmount(): number {
        if (!this.invoice.discount)
            this.invoice.discount = 0;
        this.invoice.netAmount = this.getTotalAmount - (this.getTotalAmount * this.invoice.discount) / 100
        return this.invoice.netAmount;
    }
}
