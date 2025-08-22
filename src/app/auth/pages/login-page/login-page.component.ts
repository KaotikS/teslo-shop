import { Component, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { AlertComponent } from "@shared/components/alert/alert.component";
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule, AlertComponent],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  authService = inject(AuthService)
  formBuilder = inject(FormBuilder)
  hasError = signal(false);
  router = inject(Router)

  loginForm = this.formBuilder.group({
    email: ['', [
      Validators.required,
      Validators.email
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
      Validators.maxLength(50)
    ]]
  })

  onSubmit() {
    if (this.loginForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }

    const { email = '', password = '' } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigateByUrl('/')
        return
      }
      this.hasError.set(true)
    })
  }

}
