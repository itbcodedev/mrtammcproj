import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../auth/user-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { throwIfEmpty } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  today: string;
  isLogin: Boolean = false;
  username =  '';
  constructor(private _userservice: UserServiceService,
    private _toastr: ToastrService,
    private _router: Router) {
    this._userservice.getUserName().subscribe(
      data => {
        this.username = data.toString();
        this.isLogin = true;
      },
      error => this._router.navigate(['/auth/login'])
    )
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timezone: 'Asia/Bangkok' };
    const currentDate = new Date();
    this.today = currentDate.toLocaleDateString('th-TH', options) + ' ' + currentDate.toLocaleTimeString();
  }

  ngOnInit() {
  }

  logout() {
    localStorage.removeItem('token');
    this._router.navigate(['/auth/login']);
    this._toastr.success(`login  success`)
  }
}
