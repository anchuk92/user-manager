import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { patchState, signalStore, withMethods, withState, WritableStateSource } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';

import { pipe, switchMap, tap } from 'rxjs';

import { produce } from 'immer';

import { UserApiService } from '../service/user-api-service';
import { UserData } from '../models/user-data.type';



export type UsersListState = {
  users: UserData[];
  loading: boolean;
};

export const initialState: UsersListState = {
  users: [],
  loading: false,
};

export const UsersListStore = signalStore(
  withState(initialState),
  withMethods((
      state: WritableStateSource<UsersListState>,
      userService = inject(UserApiService),
      snackBar = inject(MatSnackBar)
    ) => {
    const methods ={
      loadUsers: rxMethod<string>(
        pipe(
          tap(() =>
            patchState(state, (state) =>
              produce(state, (draft) => {
                draft.loading = true;
              }),
            ),
          ),
          switchMap((search) =>
            userService.fetchUsers(search).pipe(
              tapResponse({
                next: (users) =>
                  patchState(state, (state) =>
                    produce(state, (draft) => {
                      draft.users = users;
                      draft.loading = false;
                    }),
                  ),
                error: () =>
                  patchState(state, (state) =>
                    produce(state, (draft) => {
                      draft.loading = false;
                    }),
                  )
              }),
            ),
          ),
        ),
      ),
      addUser: rxMethod<UserData>(
        pipe(
          switchMap((newUser) =>
            userService.addNewUser(newUser).pipe(
              tapResponse({
                next: () => {
                  snackBar.open('User added successfully!', 'Close', { duration: 3000 });
                  methods.loadUsers('');
                },
                error: (error) => console.log('Something went wrong', error),
              }),
            ),
          ),
        ),
      ),
      updateUser: rxMethod<UserData>(
        pipe(
          switchMap((updatedUser) =>
            userService.updateUser(updatedUser).pipe(
              tapResponse({
                next: () => {
                  snackBar.open('User updated successfully!', 'Close', { duration: 3000 });
                  methods.loadUsers('');
                },
                error: (error) => console.log('Something went wrong', error),
              }),
            ),
          ),
        ),
      ),
      updateUserStatus: rxMethod<UserData['id']>(
        pipe(
          switchMap((userId) =>
            userService.updateUserStatus(userId).pipe(
              tapResponse({
                next: () => {
                  snackBar.open('Status changed successfully!', 'Close', { duration: 3000 });
                  methods.loadUsers('');
                },
                error: (error) => console.log('Something went wrong', error),
              }),
            ),
          ),
        ),
      ),
      deleteUser: rxMethod<UserData['id']>(
        pipe(
          switchMap((userId) =>
            userService.deleteUser(userId).pipe(
              tapResponse({
                next: () => {
                  snackBar.open('User deleted successfully!', 'Close', { duration: 3000 });
                  methods.loadUsers('');
                },
                error: (error) => console.log('Something went wrong', error),
              }),
            ),
          ),
        ),
      ),
    }

    return methods;
  }),
);

