import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthServiceService} from '../auth-service.service';
import {FormBuilder, FormControl, FormGroup, NgForm} from '@angular/forms';
import {mimeType} from '../../mime-type.validator';
import {ImagePicker} from '@ionic-native/image-picker/ngx';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    // @ViewChild('imgprofile') private img: any;
    nform: FormGroup;
    imagePreview: string;
    departments = ['Computer Science',
        'Architecture',
        'Electrical Engineering'
    ];
    imageResponse: any;
    options: any;
imageFile: any;
    constructor(public authService: AuthServiceService, private imagePicker: ImagePicker) { }

  ngOnInit() {
      // this.nform = this.formBuilder.group({
      //     image: new FormControl(null, {
      //         asyncValidators: [mimeType]
      //     })
      // });
  }

    onSignup(form: NgForm) {
        if ( form.invalid ) {
            return;
        }
        // if ( this.nform.invalid) {
        //     return;
        // }
        // this.isLoading = true;
        console.log(form.value.email,
            form.value.password, form.value.uname, form.value.dname, form.value.regno);
        this.authService.createUser(form.value.email, this.imageFile, form.value.uname, form.value.dname, form.value.regno);
    }

    getImages() {
        this.options = {
            // Android only. Max images to be selected, defaults to 15. If this is set to 1, upon
            // selection of a single image, the plugin will return it.
            maximumImagesCount: 1,

            // max width and height to allow the images to be.  Will keep aspect
            // ratio no matter what.  So if both are 800, the returned image
            // will be at most 800 pixels wide and 800 pixels tall.  If the width is
            // 800 and height 0 the image will be 800 pixels wide if the source
            // is at least that wide.
            width: 200,
            // height: 200,

            // quality of resized image, defaults to 100
            quality: 25,

            // output type, defaults to FILE_URIs.
            // available options are
            // window.imagePicker.OutputType.FILE_URI (0) or
            // window.imagePicker.OutputType.BASE64_STRING (1)
            outputType: 1
        };
        this.imageResponse = [];
        this.imagePicker.getPictures(this.options).then((results) => {
            for ( var i = 0; i < results.length; i++) {
                this.imageResponse.push('data:image/jpeg;base64,' + results[i]);
            }
            // this.imageFile = this.img.valueOf();

            // const reader = new FileReader();
            // this.imageFile =  reader.readAsDataURL(this.imageResponse);
        }, (err) => {
            alert(err);
        });
    }



    // onImagePicked(event: Event) {
    //     const file = (event.target as HTMLInputElement).files[0];
    //     this.nform.patchValue({ image: file});
    //     this.nform.get('image').updateValueAndValidity();
    //     const reader = new FileReader();
    //     reader.onload = () => {
    //         // @ts-ignore
    //         this.imagePreview = reader.result;
    //     };
    //     reader.readAsDataURL(file);
    //
    // }

}
