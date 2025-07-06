import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';


import { tapResponse } from '@ngrx/operators';
import { patchState, signalState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { pipe, switchMap, tap } from 'rxjs';

import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';
import {MatIcon} from '@angular/material/icon';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

import { UserData } from '../../models/user-data.type';
import { UserApiService } from '../../service/user-api-service';

type UserManagerState = {
  user: UserData | null;
  loading: boolean;
};

@Component({
  selector: "app-add-user-modal",
  imports: [
    MatDialogActions,
    MatError,
    MatSlideToggle,
    MatFormField,
    MatSelect,
    MatLabel,
    MatOption,
    MatError,
    MatDialogContent,
    MatIcon,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatDialogTitle,
    MatIconButton,
    MatInput,
    MatButton,
    MatProgressSpinner,
    MatProgressSpinner,
  ],
  templateUrl: "./user-manager.component.html",
  styleUrls: ["./user-manager.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagerComponent implements OnInit {
  private readonly userService = inject(UserApiService);
  private readonly dialogRef = inject(MatDialogRef<UserManagerComponent>);
  readonly data = signal(inject<{ userId?: string }>(MAT_DIALOG_DATA));

  private userManagerState = signalState<UserManagerState>({user: null, loading: false});
  readonly user = this.userManagerState.user;
  readonly loading = this.userManagerState.loading;
  readonly modalTitle = computed(() => this.data()?.userId ? 'Update user' : 'Add user');

  userForm = new FormGroup({
    name: new FormControl<UserData['name']>('', [Validators.required]),
    role: new FormControl<UserData['role']>('', [Validators.required]),
    isActive: new FormControl(false),
  });

  private loadUser = rxMethod<UserData['id']>(
    pipe(
      tap(() =>
        patchState(this.userManagerState, {loading: true})),
      switchMap((userId) =>
        this.userService.fetchUserById(userId).pipe(
          tapResponse({
            next: (user) => patchState(this.userManagerState, {user, loading: false}),
            error: () => patchState(this.userManagerState, {loading: false}),
          }),
        ),
      ),
    ),
  );

  constructor() {
    effect(() => {
        const userId = this.data()?.userId;
        if (userId && this.user()) {
          this.userForm.patchValue({
            name: this.user()?.name,
            role: this.user()?.role,
            isActive: this.user()?.isActive,
          });
        }
      }
    );
  }

  ngOnInit() {
    if (this.data()?.userId) {
      this.loadUser(this.data().userId);
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const user = {
        name: this.userForm.value?.name || '',
        role: this.userForm.value?.role || '',
        isActive: this.userForm.value?.isActive || false,
      }

      this.closeModal(user)
    }
  }

  closeModal(user?: UserData) {
    this.dialogRef.close(user);
  }
}
