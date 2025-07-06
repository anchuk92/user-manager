import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { ConfirmationActions } from '../../../models/confirmation-actions.enum';


@Component({
  selector: 'app-confirmation-modal',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: 'confirmation-modal.component.html',
})
export class ConfirmationModalComponent {
  private readonly dialogRef = inject(MatDialogRef<ConfirmationModalComponent>);
  readonly data = inject<{ action: ConfirmationActions }>(MAT_DIALOG_DATA);

  readonly confirmationText = computed(() =>
    this.data.action === ConfirmationActions.Delete
      ? "Are you sure you want to delete this user?"
      : "Are you sure you want to change this user's status?"
  );

  onCancel() {
    this.dialogRef.close(false);
  }

  onConfirm() {
    this.dialogRef.close(true);
  }
}
