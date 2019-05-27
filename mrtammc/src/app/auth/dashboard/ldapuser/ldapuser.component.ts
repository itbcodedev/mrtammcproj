import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../user-service.service';
@Component({
  selector: 'app-ldapuser',
  templateUrl: './ldapuser.component.html',
  styleUrls: ['./ldapuser.component.scss']
})
export class LdapuserComponent implements OnInit {
  users: any = [];
  constructor(private _userservice: UserServiceService) { }

  ngOnInit() {
    this.listuser();

    console.log(this.users);
  }

  listuser() {
      console.log("list user function");
      this._userservice.ldaplist()
      .subscribe(
        data => {
          this.users = data.body;
        },
        error => {}
        );
  }
}
