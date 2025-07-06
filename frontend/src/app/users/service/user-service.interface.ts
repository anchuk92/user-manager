import { Observable } from 'rxjs';
import { UserData } from '../models/user-data.type';

export interface UserManagerService {
  fetchUsers(search: string): Observable<UserData[]>;
  fetchUserById(userId: UserData['id']): Observable<UserData>;

  addNewUser(userData: UserData): Observable<void>;
  updateUser(userData: UserData): Observable<void>;
  updateUserStatus(userId: UserData['id']): Observable<void>;
  deleteUser(userId: UserData['id']): Observable<void>;
}
