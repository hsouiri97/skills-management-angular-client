import { Component, OnInit } from "@angular/core";
import {
  Router,
  NavigationEnd,
  NavigationStart,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
  RoutesRecognized,
} from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "demo1";

  showSidebar: boolean = true;
  showNavbar: boolean = true;
  showFooter: boolean = true;
  isLoading: boolean;

  constructor(private router: Router) {
    // Removing Sidebar, Navbar, Footer for Documentation, Error and Auth pages
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (
          event["url"] == "/index/login" ||
          event["url"] == "/user-pages/login" ||
          event["url"] == "/user-pages/register" ||
          event["url"].startsWith("/error-pages")
        ) {
          this.cleanThePage();
          if (
            event["url"] == "/error-pages/404" ||
            event["url"] == "/error-pages/500"
          ) {
            document.querySelector(".content-wrapper").classList.add("p-0");
          }
        } else {
          this.addTheBars();
        }
      }
    });

    // Spinner for lazyload modules
    router.events.subscribe((event) => {
      if (event instanceof RouteConfigLoadStart) {
        this.isLoading = true;
        if (event.route.path.startsWith("error-pages")) {
          this.cleanThePage();
          document.querySelector(".content-wrapper").classList.add("p-0");
        }
      } else if (event instanceof RouteConfigLoadEnd) {
        this.isLoading = false;
      }
    });
  }

  ngOnInit() {
    // Scroll to top after route change
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  cleanThePage(): void {
    this.showSidebar = false;
    this.showNavbar = false;
    this.showFooter = false;
    document.querySelector(".main-panel").classList.add("w-100");
    document
      .querySelector(".page-body-wrapper")
      .classList.add("full-page-wrapper");
    document
      .querySelector(".content-wrapper")
      .classList.remove("auth", "auth-img-bg");
    document
      .querySelector(".content-wrapper")
      .classList.remove("auth", "lock-full-bg");
  }

  addTheBars() {
    this.showSidebar = true;
    this.showNavbar = true;
    this.showFooter = true;
    document.querySelector(".main-panel").classList.remove("w-100");
    document
      .querySelector(".page-body-wrapper")
      .classList.remove("full-page-wrapper");
    document
      .querySelector(".content-wrapper")
      .classList.remove("auth", "auth-img-bg");
    document.querySelector(".content-wrapper").classList.remove("p-0");
  }
}
