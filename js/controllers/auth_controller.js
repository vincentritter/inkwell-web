import { Controller } from "../stimulus.js";
import { getToken, saveToken, clearToken } from "../api/auth.js";

export default class extends Controller {
  static targets = ["signin", "app"];

  connect() {
    this.showSignin();
  }

  signin() {
    const token = "mock-token";
    saveToken(token);
    this.showApp();
  }

  signout() {
    clearToken();
    this.showSignin();
  }

  restoreSession() {
    const token = getToken();
    if (token) {
      this.showApp();
      return;
    }

    this.showSignin();
  }

  showApp() {
    this.appTarget.hidden = false;
    this.signinTarget.hidden = true;
    window.dispatchEvent(new CustomEvent("auth:ready"));
  }

  showSignin() {
    this.signinTarget.hidden = false;
    this.appTarget.hidden = true;
  }
}
