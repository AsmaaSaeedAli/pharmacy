import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { HostDashboardComponent } from './dashboard/host-dashboard.component';
import { DemoUiComponentsComponent } from './demo-ui-components/demo-ui-components.component';
import { EditionsComponent } from './editions/editions.component';
import { InstallComponent } from './install/install.component';
import { LanguageTextsComponent } from './languages/language-texts.component';
import { LanguagesComponent } from './languages/languages.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { OrganizationUnitsComponent } from './organization-units/organization-units.component';
import { RolesComponent } from './roles/roles.component';
import { HostSettingsComponent } from './settings/host-settings.component';
import { TenantSettingsComponent } from './settings/tenant-settings.component';
import { InvoiceComponent } from './subscription-management/invoice/invoice.component';
import { SubscriptionManagementComponent } from './subscription-management/subscription-management.component';
import { TenantsComponent } from './tenants/tenants.component';
import { UiCustomizationComponent } from './ui-customization/ui-customization.component';
import { UsersComponent } from './users/users.component';
import { LookupsComponent } from './lookups/lookups.component';
import { CountriesComponent } from './address/countries/countries.component';
import { RegionsComponent } from './address/regions/regions.component';
import { CitiesComponent } from './address/cities/cities.component';
import { EmployeesComponent } from './employees/employees.component';
import { BranchesComponent } from './branches/branches.component';
import { JobsComponent } from './jobs/jobs.component';
import { CorporatesComponent } from './corporates/corporates.component';
import { CategoriesComponent } from './categories/categories.component';
import { SubCategoriesComponent } from './subcategories/subcategories.component';
import { ItemClassesComponent } from './item-classes/item-classes.component'; 
import{ItemsComponent} from './items/items/items.component';
import { ViewItemModalComponent } from './items/items/view-items-modal/view-item-modal.component';
import{ItemQuantitiesComponent} from './items/item-quantities/item-quantities.component';
import {ManuFactoriesComponent } from './manufactories/manufactories.component';
import { CreateOrEditItemModalComponent } from './items/items/create-or-edit-item-modal/create-or-edit-item-modal.component';
import { ItemPriceModalComponent } from './items/items/item-price/item-price-modal.component';
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'branches', component: BranchesComponent, data: { permission: 'Pages.Administration.Branches' } },
                    { path: 'employees', component: EmployeesComponent, data: { permission: 'Pages.Administration.Employees' } },
                    { path: 'cities', component: CitiesComponent, data: { permission: 'Pages.Administration.Host.Cities' } },
                    { path: 'regions', component: RegionsComponent, data: { permission: 'Pages.Administration.Host.Regions' } },
                    { path: 'countries', component: CountriesComponent, data: { permission: 'Pages.Administration.Host.Countries' } },
                    { path: 'lookups', component: LookupsComponent, data: { permission: 'Pages.Administration.Host.Lookups' } },
                    { path: 'corporates', component: CorporatesComponent, data: { permission: 'Pages.Administration.Corporates' } },
                    { path: 'users', component: UsersComponent, data: { permission: 'Pages.Administration.Users' } },
                    { path: 'roles', component: RolesComponent, data: { permission: 'Pages.Administration.Roles' } },
                    { path: 'auditLogs', component: AuditLogsComponent, data: { permission: 'Pages.Administration.AuditLogs' } },
                    { path: 'maintenance', component: MaintenanceComponent, data: { permission: 'Pages.Administration.Host.Maintenance' } },
                    { path: 'hostSettings', component: HostSettingsComponent, data: { permission: 'Pages.Administration.Host.Settings' } },
                    { path: 'editions', component: EditionsComponent, data: { permission: 'Pages.Editions' } },
                    { path: 'languages', component: LanguagesComponent, data: { permission: 'Pages.Administration.Languages' } },
                    { path: 'languages/:name/texts', component: LanguageTextsComponent, data: { permission: 'Pages.Administration.Languages.ChangeTexts' } },
                    { path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' } },
                    { path: 'organization-units', component: OrganizationUnitsComponent, data: { permission: 'Pages.Administration.OrganizationUnits' } },
                    { path: 'subscription-management', component: SubscriptionManagementComponent, data: { permission: 'Pages.Administration.Tenant.SubscriptionManagement' } },
                    { path: 'invoice/:paymentId', component: InvoiceComponent, data: { permission: 'Pages.Administration.Tenant.SubscriptionManagement' } },
                    { path: 'tenantSettings', component: TenantSettingsComponent, data: { permission: 'Pages.Administration.Tenant.Settings' } },
                    { path: 'hostDashboard', component: HostDashboardComponent, data: { permission: 'Pages.Administration.Host.Dashboard' } },
                    { path: 'demo-ui-components', component: DemoUiComponentsComponent, data: { permission: 'Pages.DemoUiComponents' } },
                    { path: 'jobs', component: JobsComponent, data: { permission: 'Pages.Administration.Jobs' } },
                    { path: 'categories', component: CategoriesComponent, data: { permission: 'Pages.Administration.Host.Categories' } },
                    { path: 'subcategories', component: SubCategoriesComponent, data: { permission: 'Pages.Administration.Host.SubCategories' } },
                    { path: 'itemclasses', component: ItemClassesComponent, data: { permission: 'Pages.Administration.Host.ItemClasses' } },
                    { path: 'items', component: ItemsComponent, data: { permission: 'Pages.Administration.Items' } },
                    { path: 'items/create', component: CreateOrEditItemModalComponent, data: { permission: 'Pages.Administration.Items.Manage' } },
                    { path: 'items/edit/:itemId', component: CreateOrEditItemModalComponent, data: { permission: 'Pages.Administration.Items.Manage' } },
                    { path: 'items/view/:itemId', component: ViewItemModalComponent, data: { permission: 'Pages.Administration.Items' } },
                    { path: 'itemprices', component: ItemPriceModalComponent, data: { permission: 'Pages.Administration.Tenants.ItemPrices' } },
                    { path: 'itemquantities', component: ItemQuantitiesComponent, data: { permission: 'Pages.Administration.Tenants.ItemQuantities' } },
                    { path: 'manufactories', component: ManuFactoriesComponent, data: { permission: 'Pages.Administration.ManuFactories' } },
                    { path: 'install', component: InstallComponent },
                    { path: 'ui-customization', component: UiCustomizationComponent },
                    { path: '', redirectTo: 'hostDashboard', pathMatch: 'full' }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AdminRoutingModule {

    constructor(
        private router: Router
    ) {
        router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                window.scroll(0, 0);
            }
        });
    }
}
