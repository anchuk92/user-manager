import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { UserData } from '../../models/user-data.type';
import { ConfirmationActions } from '../../models/confirmation-actions.enum';
import { UsersListStore } from '../../state/users-list.store';
import { UserManagerComponent } from '../user-manager/user-manager.component';
import { ConfirmationModalComponent } from './confirmation-modal.component/confirmation-modal.component';


@Component({
  selector: 'app-users-list',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDivider,
    MatFormField,
    MatLabel,
    MatInputModule,
    MatProgressSpinner,
  ],
  providers: [UsersListStore],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class UsersListComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly usersListStore = inject(UsersListStore);

  readonly users = this.usersListStore.users;
  readonly loading = this.usersListStore.loading;
  readonly displayedColumns: string[] = ['name', 'role', 'status', 'actions'];

  ngOnInit(): void {
    this.usersListStore.loadUsers('');
  }

  search(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.usersListStore.loadUsers(searchValue);
  }

  addNewUser() {
    const dialogRef = this.dialog.open(UserManagerComponent, {
      width: '500px',
      disableClose: true,
      autoFocus: false,
      restoreFocus: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usersListStore.addUser(result);
      }
    });
  }

  editUser(user: UserData) {
    const dialogRef = this.dialog.open(UserManagerComponent, {
      data: { userId: user.id },
      width: '500px',
      disableClose: true,
      autoFocus: false,
      restoreFocus: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usersListStore.updateUser({...result, id: user.id });
      }
    });
  }

  changeStatus(user: UserData) {
    this.dialog.open(ConfirmationModalComponent, {
      data: {action: ConfirmationActions.ChangeStatus},
    }).afterClosed().subscribe(result => {
      if (result) {
        this.usersListStore.updateUserStatus(user.id);
      }
    });
  }

  deleteItem(user: UserData) {
    this.dialog.open(ConfirmationModalComponent, {
      data: {action: ConfirmationActions.Delete},
    }).afterClosed().subscribe(result => {
      if (result) {
        this.usersListStore.deleteUser(user.id);
      }
    });
  }
}
