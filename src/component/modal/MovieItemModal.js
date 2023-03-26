import {
  apiStatus,
  ImgSrc,
  RateCaption,
  RATE_RANGE,
  USER_RATE_STORAGE_KEY,
} from "../../constant/movieConstants";
import MovieManager from "../../domain/MovieManager";
import { $, $$ } from "../../util/dom";
import { getData, saveData } from "../../util/localStorage";
import CustomElement from "../basic/CustomElement";

class MovieItemModal extends CustomElement {
  #movieId = null;

  connectedCallback() {
    MovieManager.subscribe(this.popUp.bind(this));
  }

  template(movieInfo) {
    const { title, starRate, src, genres, description } = movieInfo;

    return `
    <div class="backdrop" ></div>
    <div class="item-modal-container">
      <div class="item-modal-header">
        <div class='item-modal-title'>${title}</div>
        <button class="item-modal-close-button button" type="button">X</button>
      </div>
      <div class="item-modal-content">
        <img class="item-modal-thumbnail" src=${src} alt=${title} />
        <div class="item-modal-detail">
          <div class="item-modal-genre">${genres} </div>
          <div class="item-score"><img src=${ImgSrc.FULL_STAR} />${starRate}</div>
          <div class="item-modal-description">${description}</div>
          <div class="item-modal-user-rate">
            <span>내 별점</span>
            <div class="user-rate-stars">
              <img class="user-rate-star" src=${ImgSrc.EMPTY_STAR} data-value="1" />
              <img class="user-rate-star" src=${ImgSrc.EMPTY_STAR} data-value="2" />
              <img class="user-rate-star" src=${ImgSrc.EMPTY_STAR} data-value="3" />
              <img class="user-rate-star" src=${ImgSrc.EMPTY_STAR} data-value="4" />
              <img class="user-rate-star" src=${ImgSrc.EMPTY_STAR} data-value="5" />
            </div>
            <span class="user-rate-number"></span>
            <span class="user-rate-caption"></span>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  setEvent() {
    this.setCloseEvent();
    this.setRateEvent();
  }

  popUp(movieInfo) {
    this.id = movieInfo.id;
    this.insertAdjacentHTML("beforeend", this.template(movieInfo));
    this.rerenderSavedUserRate();
    this.setEvent();
  }

  setCloseEvent() {
    $(".item-modal-close-button").addEventListener("click", () => {
      this.closeModal();
    });

    $(".backdrop").addEventListener("click", () => {
      this.closeModal();
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "Escape") {
        this.closeModal();
      }
    });
  }

  closeModal() {
    this.replaceChildren();
  }

  setRateEvent() {
    $(".user-rate-stars").addEventListener("click", (e) => {
      const targetRate = Number(
        e.target.closest(".user-rate-star")?.dataset.value
      );

      if (!targetRate) {
        return;
      }

      this.rerenderUserRate(targetRate);
      saveData(USER_RATE_STORAGE_KEY, { [this.#movieId]: targetRate });
    });
  }

  rerenderSavedUserRate() {
    const rate = getData(USER_RATE_STORAGE_KEY)?.[this.id];

    if (rate) {
      this.rerenderUserRate(rate);
    }
  }

  rerenderUserRate(rate) {
    $(".user-rate-number").innerText = rate * RATE_RANGE;
    $(".user-rate-caption").innerText = RateCaption[rate];
    this.rerenderStars(rate);
  }

  rerenderStars(rate) {
    $$(".user-rate-star").forEach(($star, index) => {
      $star.src = index < rate ? ImgSrc.FULL_STAR : ImgSrc.EMPTY_STAR;
    });
  }
}

customElements.define("movie-item-modal", MovieItemModal);

export default MovieItemModal;
