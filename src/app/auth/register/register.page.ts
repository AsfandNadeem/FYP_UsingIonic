import { Component, OnInit } from '@angular/core';
import {AuthServiceService} from '../auth-service.service';
import {FormBuilder, FormControl, FormGroup, NgForm} from '@angular/forms';
import {mimeType} from '../../mime-type.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    nform: FormGroup;
    imagePreview: string;
    departments = ['Computer Science',
        'Architecture',
        'Electrical Engineering'
    ];

  constructor(public authService: AuthServiceService,
              public formBuilder: FormBuilder) { }

  ngOnInit() {
      this.nform = this.formBuilder.group({
          image: new FormControl(null, {
              asyncValidators: [mimeType]
          })
      });
  }

    onSignup(form: NgForm) {
        if ( form.invalid ) {
            return;
        }
        if ( this.nform.invalid) {
            return;
        }
        // this.isLoading = true;
        console.log(form.value.email, this.nform.value.image,
            form.value.password, form.value.uname, form.value.dname, form.value.regno);
        this.authService.createUser(form.value.email, this.nform.value.image, form.value.password,
            form.value.uname, form.value.dname, form.value.regno);
    }

    onImagePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.nform.patchValue({ image: file});
        this.nform.get('image').updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
            // @ts-ignore
            this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);

    }

}
