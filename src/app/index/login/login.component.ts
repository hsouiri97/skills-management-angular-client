import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  username: string;
  password: string;
  errMsg: string;

  @ViewChild("lform", { static: false }) loginFormDirective;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  formErrors = {
    username: "",
    password: "",
  };

  validationMessages = {
    username: {
      required: "Le nom d'utilisateur est obligatoire.",
      minlength: "Le nom d'utilisateur doit comporter au moins 2 caractères.",
    },
    password: {
      required: "Le mot de passe est obligatoire.",
      pattern:
        "Le mot de passe doit comporter au moins 8 caractères avec au moins une lettre majuscule, au moins une lettre minuscule et au moins un chiffre et un caractère spécial.",
    },
  };

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required, Validators.minLength(2)]],
      password: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&]).{8,}"
          ),
        ],
      ],
    });

    this.loginForm.valueChanges.subscribe(() => {
      this.onValueChanged();
    });

    this.onValueChanged();
  }

  onValueChanged() {
    if (!this.loginForm) {
      return;
    }

    const form = this.loginForm;

    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = "";
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + " ";
            }
          }
        }
      }
    }
  }

  onSubmit(): void {
    this.username = this.loginForm.value.username;
    this.password = this.loginForm.value.password;

    this.authService.login(this.username, this.password).subscribe(
      (res) => {
        let token: string = res.headers.get("authorization");
        this.authService.saveToken(token);
        this.router.navigateByUrl("/home/profile");
      },
      (errMsg) => {
        //console.clear();
        if (errMsg.startsWith("403")) {
          this.errMsg = "Nom d'utilsateur ou mot de passe incorrect.";
        } else {
          this.errMsg = <any>errMsg;
        }
      }
    );
  }
}
