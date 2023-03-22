import Movie from "./Movie";
import { CustomElement } from "../type/componentType";
import { MovieAppData } from "../type/movieType";

class MovieManager {
  private subscribers: CustomElement[] = [];
  private skeletonSubscriber: CustomElement | undefined;
  private errorSubscriber: CustomElement | undefined;
  private modalSubscriber: CustomElement | undefined;

  subscribe(element: CustomElement) {
    this.subscribers.push(element);
  }

  subscribeSkeleton(element: CustomElement) {
    this.skeletonSubscriber = element;
  }

  subscribeError(element: CustomElement) {
    this.errorSubscriber = element;
  }

  subscribeModal(element: CustomElement) {
    this.modalSubscriber = element;
  }

  private publish(movieAppData: MovieAppData) {
    this.subscribers.forEach((subscriber) => {
      subscriber.rerender(movieAppData);
    });
  }

  private publishError(errorMessage: string) {
    this.errorSubscriber?.rerender(errorMessage);
  }

  private hideSkeleton() {
    this.skeletonSubscriber?.remove();
  }

  private showSkeleton() {
    this.skeletonSubscriber?.show();
  }

  async showMovies(searchWord: string = "") {
    this.showSkeleton();
    const movieAppData = await Movie.getMovies(searchWord);

    if (movieAppData.error) {
      this.publishError(movieAppData.errorMessage);
      return;
    }

    this.publish(movieAppData);
    this.hideSkeleton();
  }

  async showMoreMovies() {
    this.showSkeleton();
    const movieAppData = await Movie.getMoreMovies();

    if (movieAppData.error) {
      this.publishError(movieAppData.errorMessage);
      return;
    }

    this.publish(movieAppData);
    this.hideSkeleton();
  }

  openItemModal(id: number) {
    const movieData = Movie.getMovie(id);
    this.modalSubscriber?.popUp(movieData);
  }
}

export default new MovieManager();
