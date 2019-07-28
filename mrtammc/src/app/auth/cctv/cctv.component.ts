import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cctv',
  templateUrl: './cctv.component.html',
  styleUrls: ['./cctv.component.scss']
})
export class CctvComponent implements OnInit {
  protocols = ['http', 'https', 'ws', 'rmtp']
  cctvForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.cctvForm = this.fb.group({
      code: '',
      name: '',
      protocol: '',
      host: '',
      port: '',
      username: '',
      password: '',
      latitude: '',
      longitude: '',
      description: ''
    })
  }

  ngOnInit() {
  }

}
