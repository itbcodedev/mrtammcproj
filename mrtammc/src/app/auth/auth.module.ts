import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {AdminComponent} from './admin/admin.component';
import { UserComponent } from './dashboard/user/user.component';
import { UserListComponent } from './dashboard/user-list/user-list.component';
import { AuthRoutingModule } from './auth-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UploadfileComponent } from './uploadfile/uploadfile.component';
import { ConfigfileComponent } from './configfile/configfile.component';
import { AgGridModule } from 'ag-grid-angular';
import { GtfsspecComponent } from './gtfsspec/gtfsspec.component';
import { ValidateSpecComponent } from './validate-spec/validate-spec.component';
import { LdapuserComponent } from './dashboard/ldapuser/ldapuser.component';
import { MrtalineComponent } from './mrtaline/mrtaline.component';
@NgModule({
  declarations: [LoginComponent, RegistrationComponent,AdminComponent,
                  UserComponent, UserListComponent, DashboardComponent,
                  UploadfileComponent, ConfigfileComponent, GtfsspecComponent, ValidateSpecComponent, LdapuserComponent, MrtalineComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    AgGridModule,
  ],
  exports: [LoginComponent, RegistrationComponent]
})
export class AuthModule { }
