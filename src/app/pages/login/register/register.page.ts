import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registrationForm!: UntypedFormGroup;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.registrationForm = new UntypedFormGroup({
      username: new UntypedFormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  submit(){
    this.authService.registerUser(
      this.registrationForm.controls['username'].value,
      this.registrationForm.controls['password'].value
    )
  }
}
