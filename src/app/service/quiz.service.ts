import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QuestionInfo } from '../models/question';

@Injectable({
  providedIn: 'root'
})
export class QuizService {  

  constructor(private http: HttpClient) { }

  public getQuestions(){
    return this.http.get<QuestionInfo[]>('/assets/ace-3.json')
  }
}
