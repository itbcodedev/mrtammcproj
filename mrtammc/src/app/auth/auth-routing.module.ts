import { ConfigfileComponent } from './configfile/configfile.component';
import { UploadfileComponent } from './uploadfile/uploadfile.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { LdapuserComponent } from  './dashboard/ldapuser/ldapuser.component';
import { MrtalineComponent } from './mrtaline/mrtaline.component';
import { GtfsmapComponent } from './gtfsmap/gtfsmap.component'
import { CctvComponent} from './cctv/cctv.component'
const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'config', component: ConfigfileComponent},
  {path: 'upload', component: UploadfileComponent},
  {path: 'ldapuser', component: LdapuserComponent},
  {path: 'mrtaline', component: MrtalineComponent},
  {path: 'gtfsmap', component: GtfsmapComponent},
  {path: 'cctv', component: CctvComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
