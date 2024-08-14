import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogComponent } from './components/dialog/dialog.component';
import { DialogService } from './services/dialog/dialog.service';
import { catchError, combineLatest, map, of, take } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [DialogService],
})
export class AppComponent {
  title = 'Dialog';

  constructor(
    private dialogService: DialogService
  ) {}

  openAcknowledgeDialog() {
    this.dialogService.openAcknowledgeDialog({
      title: 'Acknowledge Dialog',
      message: 'This is an Acknowledgement Dialog.',
      buttonOptions: ['OK'],
      buttonStylingOptions: {
        color: 'black',
        backgroundColor: 'white',
      },
    }).onAcknowledge().pipe(
      take(1),
      map((res) => {
        this.openAlertDialog(`You chose: ${res}`);
      }),
      catchError((err) => {
        console.log(err);
        return of(err);
      })
    ).subscribe();

  }

  openConfirmDialog() {
    const dialog= this.dialogService.openConfirmDialog({
      title: 'Confirm Dialog',
      message: 'This is a Confirmation Dialog.',
      buttonOptions: ['Yes', 'No'],
      buttonStylingOptions: {
        color: 'black',
        backgroundColor: 'white',
      },
    })
    combineLatest([
      dialog.onConfirm().pipe(
        take(1), 
        map(() => {
          this.openAlertDialog('You confirmed the dialog prompt');
        }),
        catchError((err) => {
          this.openAlertDialog(`Error: ${err}`);
          return of(err);
        })
      ),
      dialog.onReject().pipe(
        take(1), 
        map(() => {
          this.openAlertDialog('You rejected the dialog prompt');
        }),
        catchError((err) => {
          this.openAlertDialog(`Error: ${err}`);
          return of(err);
        })
      ),
    ]).pipe(take(1)).subscribe();

  }

  openChoiceDialog() {
    const dialog = this.dialogService.openChoiceDialog({
      title: 'Choice Dialog',
      message: 'This is a Choice Dialog.',
      canClose: true,
      buttonOptions: ['OK', 'Skip', 'Cancel'],
    })
    combineLatest([
      dialog.onChoice().pipe(
        take(1), 
        map((res) => {
          this.openAlertDialog(`You chose: ${res}`);
        }),
        catchError((err) => {
          this.openAlertDialog(`Error: ${err}`);
          return of(err);
        })
      ),
      dialog.onCancel().pipe(
        take(1), 
        map(() => {
          this.openAlertDialog('You cancelled the dialog prompt');
        }),
        catchError((err) => {
          this.openAlertDialog(`Error: ${err}`);
          return of(err);
        })
      ),

    ]).pipe(take(1)).subscribe();
  }

  openAlertDialog(message: string, closeAfter: number = 5000) {
    this.dialogService.openAlertDialog({
      message: message,
      closeAfter: closeAfter,
      showTimer: true,
      title: 'Alert',
    })
  }
  
}
