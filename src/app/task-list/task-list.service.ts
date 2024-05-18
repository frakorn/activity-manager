import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Activity } from '../types';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class TaskListService {

  constructor(private httpClient: HttpClient) { }

getActivity(): Observable<Activity> {
  return this.httpClient.get<Activity>(environment.activityUrl);
}

getActivityDetail(key:string): Observable<Activity> {
  return this.httpClient.get<Activity>(environment.activityDetailUrl+key);
}

}