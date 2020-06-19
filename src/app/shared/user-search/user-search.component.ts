import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { User } from "../models/User";
import { Observable, Subject } from "rxjs";
import { UsersManagementService } from "../../services/users-management.service";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";

@Component({
  selector: "app-user-search",
  templateUrl: "./user-search.component.html",
  styleUrls: ["./user-search.component.scss"],
})
export class UserSearchComponent implements OnInit {
  users$: Observable<User[]>;
  private serachTerms = new Subject<string>();
  @Output() onUserSelected: EventEmitter<any> = new EventEmitter<any>();

  constructor(private userService: UsersManagementService) {}

  ngOnInit() {
    this.users$ = this.serachTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.userService.searchUsers(term))
    );
  }

  search(term: string): void {
    this.serachTerms.next(term);
  }

  select(user: User): void {
    this.onUserSelected.emit(user);
  }
}
