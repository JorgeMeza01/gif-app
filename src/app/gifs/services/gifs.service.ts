import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({providedIn: 'root'})


// const GIPHY_API_KEY: string = 'XfQXFM6uaIUTK7LE3xtLB1zu3sMtzIR4';


export class GifsService {


  public gifList: Gif[]=[];

  private _tagsHistory: string[] = [];

  private apiKey: string = 'XfQXFM6uaIUTK7LE3xtLB1zu3sMtzIR4';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';


  constructor( private http: HttpClient ) {
    this.loadLocalStorage();
    console.log('GIFS Service Ready!');

  }


  get tagsHistory(){
    return [...this._tagsHistory];
  }


  private organizeHistory(tag: string){
    tag = tag.toLowerCase();

    if(this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag)
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this.tagsHistory.splice(0,10);
    this.saveLocalStorage();
  }

  private saveLocalStorage():void{
    localStorage.setItem('history', JSON.stringify(this.tagsHistory));
  }

  private loadLocalStorage():void{

    if(!localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')! );


    if(this._tagsHistory.length === 0) return;
    const firstElement = this._tagsHistory[0];
    this.searchTag(firstElement)

  }

  //Método asincrono
  public searchTag(tag:string):void{

    if(tag.length === 0)return;

    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', 10)
      .set('q', tag)


    this.http.get<SearchResponse>(`${ this.serviceUrl }/search`,{ params })
    .subscribe( resp => {
      this.gifList = resp.data;
      // console.log({gifs: this.gifList});
    })


    // const res = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${this.apiKey}&q=${tag}&limit=10`);

    // const data = await res.json();
    // console.log(data);


    // .then(resp => resp.json())
    // .then(data => console.log(data));

  }

}
