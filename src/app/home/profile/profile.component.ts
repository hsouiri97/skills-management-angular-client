import { Component, OnInit, ViewChild } from "@angular/core";
import { ProfileService } from "../../services/profile.service";
import { User } from "../../shared/models/User";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  user: User;
  userCopy: User = new User();
  errMsg: string;
  profileForm: FormGroup;

  @ViewChild("prform", { static: false }) profileFormDirective;

  fieldsetDisabled: boolean = true;

  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder
  ) {
    this.createForm();
  }

  formErrors = {
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    address: "",
    cin: "",
  };

  validationMessages = {
    firstName: {
      required: "Le prénom est obligatoire.",
      maxlength: "Le prénom peut comporter au maximum 20 caractères.",
    },
    lastName: {
      required: "Le nom de famille est obligatoire.",
      maxlength: "Le nom de famille peut comporter au maximum 40 caractères.",
    },
    email: {
      required: "L'email est obligatoire.",
      pattern: "Veuillez saisir une adresse e-mail valide.",
    },
    mobile: {
      required: "Le numéro de mobile est obligatoire.",
      pattern: "Veuillez saisir un numéro de mobile valide.",
    },
    address: {
      required: "L'adresse est obligatoire.",
      maxlength: "L'adresse' peut comporter au maximum 250 caractères.",
    },
    cin: {
      required: "Le CIN est obligatoire.",
      maxlength: "Le CIN doit comporter 8 caractéres.",
      minlength: "Le CIN doit comporter 8 caractéres.",
    },
  };

  ngOnInit() {
    this.profileService.getProfile().subscribe(
      (User) => {
        this.user = User;
        this.userCopy = { ...this.user };
        console.log(this.userCopy);
        //this.createForm();
      },
      (errMsg) => {
        this.errMsg = <any>errMsg;
        console.log(this.errMsg);
      }
    );
  }

  createForm(): void {
    this.profileForm = this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.maxLength(20)]],
      lastName: ["", [Validators.required, Validators.maxLength(40)]],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      mobile: ["", [Validators.required, Validators.pattern("[0-9]*")]],
      address: ["", [Validators.required, Validators.maxLength(250)]],
      cin: [
        "",
        [Validators.required, Validators.minLength(8), Validators.maxLength(8)],
      ],
      gender: "",
      username: "",
      diploma: "",
      quote: "",
    });

    this.profileForm.valueChanges.subscribe(() => {
      this.onValueChanged();
    });

    this.onValueChanged();
  }

  enableForm(): void {
    this.fieldsetDisabled = false;
  }

  disableForm(): void {
    this.fieldsetDisabled = true;

    this.resetForm();
  }

  resetForm(): void {
    const {
      firstName,
      lastName,
      gender,
      username,
      email,
      mobile,
      address,
      cin,
      diploma,
      quote,
    } = this.user;
    this.profileForm.reset({
      firstName,
      lastName,
      gender,
      username,
      email,
      mobile,
      address,
      cin,
      diploma,
      quote,
    });
  }

  onValueChanged() {
    if (!this.profileForm) {
      return;
    }

    const form = this.profileForm;
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
    this.profileService.updateProfile(this.userCopy).subscribe(
      (user) => {
        this.user = user;
        this.disableForm();
      },
      (errMsg) => {
        this.errMsg = <any>errMsg;
        console.log(errMsg);
      }
    );
  }
}
