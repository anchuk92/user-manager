import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UserManagerService } from './user-service.interface';
import { UserData } from '../models/user-data.type';


@Injectable({
  providedIn: 'root'
})
export class UserApiService implements UserManagerService{
  private readonly httpApiClient = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  fetchUsers(search: string): Observable<UserData[]> {
    const params = new HttpParams({ fromObject: { search } });
    return this.httpApiClient.get<UserData[]>(`${this.baseUrl}/users`, { params });
  }

  fetchUserById(userId: UserData['id']): Observable<UserData> {
    return this.httpApiClient.get<UserData>(`${this.baseUrl}/users/${userId}`);
  }

  addNewUser(userData: UserData): Observable<void> {
    return this.httpApiClient.post<void>(`${this.baseUrl}/users`, userData);
  }

  updateUser(userData: UserData): Observable<void> {
    return this.httpApiClient.put<void>(`${this.baseUrl}/users/${userData.id}`, userData);
  }

  updateUserStatus(userId: UserData['id']): Observable<void> {
    return this.httpApiClient.patch<void>(`${this.baseUrl}/users/${userId}`, {});
  }

  deleteUser(userId: UserData['id']): Observable<void> {
    return this.httpApiClient.delete<void>(`${this.baseUrl}/users/${userId}`);
  }
}
