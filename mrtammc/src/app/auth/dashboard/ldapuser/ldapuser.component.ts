import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import { UserServiceService } from '../../user-service.service';

@Component({
  selector: 'app-ldapuser',
  templateUrl: './ldapuser.component.html',
  styleUrls: ['./ldapuser.component.scss']
})
export class LdapuserComponent implements OnInit {
  users: any = [];
  userForm: FormGroup;
  roles = ['admin', 'member']

  constructor(private _userservice: UserServiceService,
              private fb: FormBuilder
    ) { }

  ngOnInit() {
    this.listuser();
    this.userForm = this.fb.group({
      email: ['',  [Validators.required, Validators.email] ],
      fullname: ['' , Validators.required],
      role: ['', Validators.required]
    });
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

  listldapuser() {
    console.log("list user function");
    this._userservice.listldapuser()
    .subscribe(
      data => {
        this.ldapusers = data.body;
      },
      error => {}
      );
  }
  onSubmit(){
    if (this.userForm.dirty && this.userForm.valid) {
      alert(`Name: ${this.userForm.value.fullname} Email: ${this.userForm.value.email}`);
      this._userservice.createldapuser(this.userForm.value)
    } else {
      return;
    }
  }
}
