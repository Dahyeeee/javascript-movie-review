import CustomElement from "../basic/CustomElement";
import { $ } from "../../util/dom";
import "./MovieList";
import "./ShowMoreButton";

class MovieContainer extends CustomElement {
  template() {
    return `
        <section class="item-view">
          <h2 class='movie-container-title'>지금 인기 있는 영화</h2>
          <movie-list></movie-list>
          <show-more-button></show-more-button>
        </section>
    `;
  }

  rerender(searchWord) {
    $(".movie-container-title").innerText = `'${searchWord}' 검색 결과`;
  }
}

customElements.define("movie-container", MovieContainer);

export default MovieContainer;
