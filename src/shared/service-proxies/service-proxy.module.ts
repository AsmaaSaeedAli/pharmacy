import { AbpHttpInterceptor, RefreshTokenService } from '@abp/abpHttpInterceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import * as ApiServiceProxies from './service-proxies';
import { ZeroRefreshTokenService } from '@account/auth/zero-refresh-token.service';

@NgModule({
    providers: [
        ApiServiceProxies.ManuFactoriesServiceProxy,
        ApiServiceProxies.ItemPricesServiceProxy,
        ApiServiceProxies.CustomersServiceProxy,
        ApiServiceProxies.EmployeesServiceProxy,
        ApiServiceProxies.BranchesServiceProxy,
        ApiServiceProxies.CitiesServiceProxy,
        ApiServiceProxies.RegionsServiceProxy,
        ApiServiceProxies.CountriesServiceProxy,
        ApiServiceProxies.JobsServiceProxy,
        ApiServiceProxies.LookupsServiceProxy,
        ApiServiceProxies.CorporatesServiceProxy,
        ApiServiceProxies.AuditLogServiceProxy,
        ApiServiceProxies.CachingServiceProxy,
        ApiServiceProxies.ChatServiceProxy,
        ApiServiceProxies.CommonLookupServiceProxy,
        ApiServiceProxies.EditionServiceProxy,
        ApiServiceProxies.CategoriesServiceProxy,
        ApiServiceProxies.ItemClassesServiceProxy,
        ApiServiceProxies.ItemsServiceProxy,
        ApiServiceProxies.ItemQuantitiesServiceProxy,
        ApiServiceProxies.SubCategoriesServiceProxy,
        ApiServiceProxies.FriendshipServiceProxy,
        ApiServiceProxies.HostSettingsServiceProxy,
        ApiServiceProxies.InstallServiceProxy,
        ApiServiceProxies.LanguageServiceProxy,
        ApiServiceProxies.NotificationServiceProxy,
        ApiServiceProxies.OrganizationUnitServiceProxy,
        ApiServiceProxies.PermissionServiceProxy,
        ApiServiceProxies.ProfileServiceProxy,
        ApiServiceProxies.RoleServiceProxy,
        ApiServiceProxies.SessionServiceProxy,
        ApiServiceProxies.TenantServiceProxy,
        ApiServiceProxies.TenantDashboardServiceProxy,
        ApiServiceProxies.TenantSettingsServiceProxy,
        ApiServiceProxies.TimingServiceProxy,
        ApiServiceProxies.UserServiceProxy,
        ApiServiceProxies.UserLinkServiceProxy,
        ApiServiceProxies.UserLoginServiceProxy,
        ApiServiceProxies.WebLogServiceProxy,
        ApiServiceProxies.AccountServiceProxy,
        ApiServiceProxies.TokenAuthServiceProxy,
        ApiServiceProxies.TenantRegistrationServiceProxy,
        ApiServiceProxies.HostDashboardServiceProxy,
        ApiServiceProxies.PaymentServiceProxy,
        ApiServiceProxies.DemoUiComponentsServiceProxy,
        ApiServiceProxies.InvoiceServiceProxy,
        ApiServiceProxies.SubscriptionServiceProxy,
        ApiServiceProxies.InstallServiceProxy,
        ApiServiceProxies.UiCustomizationSettingsServiceProxy,
        ApiServiceProxies.PayPalPaymentServiceProxy,
        ApiServiceProxies.StripePaymentServiceProxy,
        ApiServiceProxies.DashboardCustomizationServiceProxy,
        
        { provide: RefreshTokenService, useClass: ZeroRefreshTokenService },
        { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true }
    ]
})
export class ServiceProxyModule { }
