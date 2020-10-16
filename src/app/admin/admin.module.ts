import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { AddMemberModalComponent } from 'app/admin/organization-units/add-member-modal.component';
import { AddRoleModalComponent } from 'app/admin/organization-units/add-role-modal.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ModalModule, PopoverModule, TabsModule, TooltipModule, BsDropdownModule } from 'ngx-bootstrap';
import { BsDatepickerModule, BsDatepickerConfig, BsDaterangepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule as PrimeNgFileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TreeModule } from 'primeng/tree';
import { DragDropModule } from 'primeng/dragdrop';
import { TreeDragDropService } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { AdminRoutingModule } from './admin-routing.module';
import { AuditLogDetailModalComponent } from './audit-logs/audit-log-detail-modal.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { HostDashboardComponent } from './dashboard/host-dashboard.component';
import { DemoUiComponentsComponent } from './demo-ui-components/demo-ui-components.component';
import { DemoUiDateTimeComponent } from './demo-ui-components/demo-ui-date-time.component';
import { DemoUiEditorComponent } from './demo-ui-components/demo-ui-editor.component';
import { DemoUiFileUploadComponent } from './demo-ui-components/demo-ui-file-upload.component';
import { DemoUiInputMaskComponent } from './demo-ui-components/demo-ui-input-mask.component';
import { DemoUiSelectionComponent } from './demo-ui-components/demo-ui-selection.component';
import { CreateEditionModalComponent } from './editions/create-edition-modal.component';
import { EditEditionModalComponent } from './editions/edit-edition-modal.component';
import { MoveTenantsToAnotherEditionModalComponent } from './editions/move-tenants-to-another-edition-modal.component';
import { EditionsComponent } from './editions/editions.component';
import { InstallComponent } from './install/install.component';
import { CreateOrEditLanguageModalComponent } from './languages/create-or-edit-language-modal.component';
import { EditTextModalComponent } from './languages/edit-text-modal.component';
import { LanguageTextsComponent } from './languages/language-texts.component';
import { LanguagesComponent } from './languages/languages.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { CreateOrEditUnitModalComponent } from './organization-units/create-or-edit-unit-modal.component';
import { OrganizationTreeComponent } from './organization-units/organization-tree.component';
import { OrganizationUnitMembersComponent } from './organization-units/organization-unit-members.component';
import { OrganizationUnitRolesComponent } from './organization-units/organization-unit-roles.component';
import { OrganizationUnitsComponent } from './organization-units/organization-units.component';
import { CreateOrEditRoleModalComponent } from './roles/create-or-edit-role-modal.component';
import { RolesComponent } from './roles/roles.component';
import { HostSettingsComponent } from './settings/host-settings.component';
import { TenantSettingsComponent } from './settings/tenant-settings.component';
import { EditionComboComponent } from './shared/edition-combo.component';
import { FeatureTreeComponent } from './shared/feature-tree.component';
import { OrganizationUnitsTreeComponent } from './shared/organization-unit-tree.component';
import { PermissionComboComponent } from './shared/permission-combo.component';
import { PermissionTreeComponent } from './shared/permission-tree.component';
import { RoleComboComponent } from './shared/role-combo.component';
import { InvoiceComponent } from './subscription-management/invoice/invoice.component';
import { SubscriptionManagementComponent } from './subscription-management/subscription-management.component';
import { CreateTenantModalComponent } from './tenants/create-tenant-modal.component';
import { EditTenantModalComponent } from './tenants/edit-tenant-modal.component';
import { TenantFeaturesModalComponent } from './tenants/tenant-features-modal.component';
import { TenantsComponent } from './tenants/tenants.component';
import { UiCustomizationComponent } from './ui-customization/ui-customization.component';
import { DefaultThemeUiSettingsComponent } from './ui-customization/default-theme-ui-settings.component';
import { Theme2ThemeUiSettingsComponent } from './ui-customization/theme2-theme-ui-settings.component';
import { Theme3ThemeUiSettingsComponent } from './ui-customization/theme3-theme-ui-settings.component';
import { Theme4ThemeUiSettingsComponent } from './ui-customization/theme4-theme-ui-settings.component';
import { Theme5ThemeUiSettingsComponent } from './ui-customization/theme5-theme-ui-settings.component';
import { Theme6ThemeUiSettingsComponent } from './ui-customization/theme6-theme-ui-settings.component';
import { Theme7ThemeUiSettingsComponent } from './ui-customization/theme7-theme-ui-settings.component';
import { Theme8ThemeUiSettingsComponent } from './ui-customization/theme8-theme-ui-settings.component';
import { Theme9ThemeUiSettingsComponent } from './ui-customization/theme9-theme-ui-settings.component';
import { Theme10ThemeUiSettingsComponent } from './ui-customization/theme10-theme-ui-settings.component';
import { Theme11ThemeUiSettingsComponent } from './ui-customization/theme11-theme-ui-settings.component';
import { Theme12ThemeUiSettingsComponent } from './ui-customization/theme12-theme-ui-settings.component';
import { CreateOrEditUserModalComponent } from './users/create-or-edit-user-modal.component';
import { EditUserPermissionsModalComponent } from './users/edit-user-permissions-modal.component';
import { ImpersonationService } from './users/impersonation.service';
import { UsersComponent } from './users/users.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CountoModule } from 'angular2-counto';
import { TextMaskModule } from 'angular2-text-mask';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxBootstrapDatePickerConfigService } from 'assets/ngx-bootstrap/ngx-bootstrap-datepicker-config.service';
import { DropdownModule } from 'primeng/dropdown';

// Metronic
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { PermissionTreeModalComponent } from './shared/permission-tree-modal.component';
import { LookupsComponent } from './lookups/lookups.component';
import { ViewLookupModalComponent } from './lookups/view-lookup-modal/view-lookup-modal.component';
import { CreateOrEditLookupModalComponent } from './lookups/create-or-edit-lookup-modal/create-or-edit-lookup-modal.component';
import { CitiesComponent } from './address/cities/cities.component';
import { CreateOrEditCityModalComponent } from './address/cities/create-or-edit-city-modal/create-or-edit-city-modal.component';
import { ViewCityModalComponent } from './address/cities/view-city-modal/view-city-modal.component';
import { CountriesComponent } from './address/countries/countries.component';
import { CreateOrEditCountryModalComponent } from './address/countries/create-or-edit-country-modal/create-or-edit-country-modal.component';
import { ViewCountryModalComponent } from './address/countries/view-country-modal/view-country-modal.component';
import { RegionsComponent } from './address/regions/regions.component';
import { CreateOrEditRegionModalComponent } from './address/regions/create-or-edit-region-modal/create-or-edit-region-modal.component';
import { ViewRegionModalComponent } from './address/regions/view-region-modal/view-region-modal.component';
import { EmployeesComponent } from './employees/employees.component';
import { CreateOrEditEmployeeModalComponent } from './employees/create-or-edit-employee-modal/create-or-edit-employee-modal.component';
import { CreateOrEditBranchModalComponent } from './branches/create-or-edit-branch-modal/create-or-edit-branch-modal.component';
import { BranchesComponent } from './branches/branches.component';
import { ViewEmployeeModalComponent } from './employees/view-employee-modal/view-employee-modal.component';
import { ViewBranchModalComponent } from './branches/view-branches-modal/view-branch-modal.component';
import { CreateOrEditJobModalComponent } from './jobs/create-or-edit-job-modal/create-or-edit-job-modal.component';
import { JobsComponent } from './jobs/jobs.component';
import { ViewJobModalComponent } from './jobs/view-job-modal/view-job-modal.component';

import { CreateOrEditCategoryModalComponent } from './categories/create-or-edit-category-modal/create-or-edit-category-modal.component';
import { CategoriesComponent } from './categories/categories.component';
import { ViewCategoryModalComponent } from './categories/view-categories-modal/view-category-modal.component';

import { CreateOrEditSubCategoryModalComponent } from './subcategories/create-or-edit-subcategory-modal/create-or-edit-subcategory-modal.component';
import {SubCategoriesComponent } from './subcategories/subcategories.component';
import { ViewSubCategoryModalComponent } from './subcategories/view-subcategories-modal/view-subcategory-modal.component';

import { CreateOrEditItemClassModalComponent } from './item-classes/create-or-edit-item-class-modal/create-or-edit-item-class-modal.component';
import { ItemClassesComponent } from './item-classes/item-classes.component';
import { ViewItemClassModalComponent } from './item-classes/view-item-classes-modal/view-item-class-modal.component';

import { CreateOrEditItemModalComponent } from './items/items/create-or-edit-item-modal/create-or-edit-item-modal.component';
import { ItemsComponent } from './items/items/items.component';
import { ViewItemModalComponent } from './items/items/view-items-modal/view-item-modal.component';

import { CreateOrEditItemPriceModalComponent } from './items/items/item-price/create-or-edit-item-price-modal/create-or-edit-item-price-modal.component';
import { ItemPriceModalComponent } from './items/items/item-price/item-price-modal.component';
import { ViewItemPriceModalComponent } from './items/items/item-price/view-item-prices-modal/view-item-price-modal.component';

import { CreateOrEditItemQuantityModalComponent } from './items/item-quantities/create-or-edit-item-quantity-modal/create-or-edit-item-quantity-modal.component';
import { ItemQuantitiesComponent } from './items/item-quantities/item-quantities.component';
import { ViewItemQuantityModalComponent } from './items/item-quantities/view-item-quantities-modal/view-item-quantity-modal.component';

import { CreateOrEditCorporateModalComponent } from './corporates/create-or-edit-corporate-modal/create-or-edit-corporate-modal.component';
import { CorporatesComponent } from './corporates/corporates.component';
import { ViewCorporateModalComponent } from './corporates/view-corporates-modal/view-corporate-modal.component';
import { ItemBarCodeModalComponent } from './items/items/item-bar-code/item-bar-code-modal.component';
import { CreateOrEditManuFactoryModalComponent } from './manufactories/create-or-edit-manufactory-modal/create-or-edit-manufactory-modal.component';
import { ManuFactoriesComponent } from './manufactories/manufactories.component';
import { ViewManuFactoryModalComponent } from './manufactories/view-manufactories-modal/view-manufactory-modal.component';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    // suppressScrollX: true
};

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        FileUploadModule,
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot(),
        BsDatepickerModule.forRoot(),
        AdminRoutingModule,
        UtilsModule,
        AppCommonModule,
        TableModule,
        TreeModule,
        DragDropModule,
        ContextMenuModule,
        PaginatorModule,
        PrimeNgFileUploadModule,
        AutoCompleteModule,
        EditorModule,
        InputMaskModule,
        NgxChartsModule,
        CountoModule,
        TextMaskModule,
        ImageCropperModule,
        PerfectScrollbarModule,
        DropdownModule
    ],
    declarations: [
        UsersComponent,
        PermissionComboComponent,
        RoleComboComponent,
        CreateOrEditUserModalComponent,
        EditUserPermissionsModalComponent,
        PermissionTreeComponent,
        FeatureTreeComponent,
        OrganizationUnitsTreeComponent,
        RolesComponent,
        CreateOrEditRoleModalComponent,
        AuditLogsComponent,
        AuditLogDetailModalComponent,
        HostSettingsComponent,
        InstallComponent,
        MaintenanceComponent,
        EditionsComponent,
        CreateEditionModalComponent,
        EditEditionModalComponent,
        MoveTenantsToAnotherEditionModalComponent,
        LanguagesComponent,
        LanguageTextsComponent,
        CreateOrEditLanguageModalComponent,
        TenantsComponent,
        CreateTenantModalComponent,
        EditTenantModalComponent,
        TenantFeaturesModalComponent,
        CreateOrEditLanguageModalComponent,
        EditTextModalComponent,
        OrganizationUnitsComponent,
        OrganizationTreeComponent,
        OrganizationUnitMembersComponent,
        OrganizationUnitRolesComponent,
        CreateOrEditUnitModalComponent,
        TenantSettingsComponent,
        HostDashboardComponent,
        EditionComboComponent,
        InvoiceComponent,
        SubscriptionManagementComponent,
        AddMemberModalComponent,
        AddRoleModalComponent,
        DemoUiComponentsComponent,
        DemoUiDateTimeComponent,
        DemoUiSelectionComponent,
        DemoUiFileUploadComponent,
        DemoUiInputMaskComponent,
        DemoUiEditorComponent,
        UiCustomizationComponent,
        DefaultThemeUiSettingsComponent,
        Theme2ThemeUiSettingsComponent,
        Theme3ThemeUiSettingsComponent,
        Theme4ThemeUiSettingsComponent,
        Theme5ThemeUiSettingsComponent,
        Theme6ThemeUiSettingsComponent,
        Theme7ThemeUiSettingsComponent,
        Theme8ThemeUiSettingsComponent,
        Theme9ThemeUiSettingsComponent,
        Theme10ThemeUiSettingsComponent,
        Theme12ThemeUiSettingsComponent,
        Theme11ThemeUiSettingsComponent,
        PermissionTreeModalComponent,
        LookupsComponent, ViewLookupModalComponent, CreateOrEditLookupModalComponent,
        CitiesComponent, CreateOrEditCityModalComponent, ViewCityModalComponent,
        CountriesComponent, CreateOrEditCountryModalComponent, ViewCountryModalComponent,
        RegionsComponent, CreateOrEditRegionModalComponent, ViewRegionModalComponent,
        EmployeesComponent, CreateOrEditEmployeeModalComponent, ViewEmployeeModalComponent,
        BranchesComponent, CreateOrEditBranchModalComponent, ViewBranchModalComponent,
        JobsComponent, CreateOrEditJobModalComponent, ViewJobModalComponent,
        CorporatesComponent, CreateOrEditCorporateModalComponent, ViewCorporateModalComponent,
        CategoriesComponent, CreateOrEditCategoryModalComponent, ViewCategoryModalComponent,
        SubCategoriesComponent, CreateOrEditSubCategoryModalComponent, ViewSubCategoryModalComponent,
        ItemClassesComponent, CreateOrEditItemClassModalComponent, ViewItemClassModalComponent,
        ItemsComponent,CreateOrEditItemModalComponent,ViewItemModalComponent,
        CreateOrEditItemPriceModalComponent,ViewItemPriceModalComponent,
        ItemQuantitiesComponent,CreateOrEditItemQuantityModalComponent,ViewItemQuantityModalComponent,
        ItemBarCodeModalComponent,
        ManuFactoriesComponent, CreateOrEditManuFactoryModalComponent, ViewManuFactoryModalComponent,
        ItemPriceModalComponent,

    ],
    exports: [
        AddMemberModalComponent,
        AddRoleModalComponent
    ],
    providers: [
        ImpersonationService,
        TreeDragDropService,
        { provide: BsDatepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerConfig },
        { provide: BsDaterangepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDaterangepickerConfig },
        { provide: BsLocaleService, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerLocale },
        { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG }
    ]
})
export class AdminModule { }
