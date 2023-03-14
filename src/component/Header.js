import { $ } from "../util/dom";
import CustomElement from "./basic/CustomElement";

class Header extends CustomElement {
  template() {
    return `
    <header>
        <h1><img src="./image/logo.png" alt="MovieList logo" /></h1>
      </header>
    `;
  }

  setEvent() {
    $("h1").addEventListener("click", () => {
      location.reload();
    });
  }
}

customElements.define("movie-header", Header);

export default Header;