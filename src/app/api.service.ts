import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiURL: string = 'https://api.iextrading.com/1.0/tops/last?symbols=';
  constructor(private httpClient: HttpClient) {}

  public getResponse(search_key: string){
      return this.httpClient.get(`${this.apiURL}${search_key}`);
  }
}
