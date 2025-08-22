import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  authService = inject(AuthService)
  formBuilder = inject(FormBuilder)
  router = inject(Router)
  hasError = signal(false);

  registerForm = this.formBuilder.group({
    fullName: ['', [
      Validators.required,
    ]],
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
    if (this.registerForm.invalid) {
      this.hasError.set(true)
      setTimeout(() => {
        this.hasError.set(false)
      }, 2000);
      return
    }

    const { email = '', password = '', fullName = '' } = this.registerForm.value;
    debugger
    this.authService.register(fullName!, email!, password!).subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigateByUrl('/')
        return
      }
      this.hasError.set(true)
    })
  }
}
