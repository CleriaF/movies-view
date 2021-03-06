import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MoviedbService } from 'src/app/services/moviedb.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { AccessibilityService } from 'src/app/services/accessibility.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {

  title;
  overview;
  imgMovie;
  popularity;
  rows: Array<any> = [];
  movies: Array<any> = [];
  genres: Array<any> = [];
  modalOptions: NgbModalOptions;
  @ViewChild('modal', {static: true}) public modal: ModalDirective;

  clothes = [];

  constructor(private http: HttpClient, private config: MoviedbService, private accessibility: AccessibilityService,
              private modalService: NgbModal) { }

  getGenres(){
    this.http.get<any>(this.config.app.urlBase.concat('genre/movie/list' + this.config.app.apiKey), { observe: 'response' })
      .subscribe(resp => {
        this.genres = resp.body.genres;
      });
  }

  getMovies(){
    this.http.get<any>(this.config.app.urlBase.concat('movie/popular' + this.config.app.apiKey), {observe: 'response'})
      .subscribe(resp => {
        this.rows = resp.body.results;
        this.movies = this.rows;
      });
  }

  filterGenre(id: number){
    this.http.get<any>(this.config.app.urlBase.concat('discover/movie' + this.config.app.apiKey + '&with_genres=' + id),
      {observe: 'response'})
      .subscribe(resp => {
        this.movies = resp.body.results;
      });
  }

  applyFilter(event) {
    const value = event.target.value.toLowerCase();
    const temp = this.rows.filter(row => {
      return row.title.toLowerCase().indexOf(value) !== -1 || !value;
    });
    this.movies = temp;
  }

  openDetails(content, movie){
    this.title = movie.title;
    this.overview = movie.overview;
    this.popularity = movie.popularity;
    this.imgMovie = "http://image.tmdb.org/t/p/w185/" + movie.poster_path;
    this.modalService.open(content, this.modalOptions).result.then((result) => {
    }, (reason) => {
    });
  }

  allMovies(){
    this.getMovies();
  }

  ngOnInit() {
    this.getMovies();
    this.getGenres();
  }

}
