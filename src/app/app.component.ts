import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogComponent } from './components/dialog/dialog.component';
import { DialogService } from './services/dialog/dialog.service';
import { catchError, map, Observable, of, startWith, Subject, switchMap, take } from 'rxjs';

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
    this.dialogService.openConfirmDialog({
      title: 'Confirm Dialog',
      message: 'This is a Confirmation Dialog.',
      canClose: true,
      buttonOptions: ['Yes', 'No'],
      buttonStylingOptions: {
        color: 'black',
        backgroundColor: 'white',
      },
    }).onConfirm().pipe(
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

  openChoiceDialog() {
    this.dialogService.openChoiceDialog({
      title: 'Choice Dialog',
      message: 'This is a Choice Dialog.',
      canClose: true,
      buttonOptions: ['OK', 'Skip', 'Cancel'],
    }).onChoice().pipe(
      take(1),
      map((res) => {
        console.log();
        
        this.openAlertDialog(`You chose: ${res}`);
      }),
      catchError((err) => {
        console.log(err);
        return of(err);
      })
    ).subscribe();

  }

  openAlertDialog(message: string, closeAfter: number = 5000) {
    this.dialogService.openAlertDialog({
      message: of(message),
      closeAfter: closeAfter,
      showTimer: true,
      title: 'Alert Dialog',
    })
  }
  
}
