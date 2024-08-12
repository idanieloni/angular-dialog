import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogComponent } from './dialog.component';
import { mockDialogData } from '../../testing/mock-data';
import { TConfirmDialog } from '../../types/common.types';
import { TestScheduler } from 'rxjs/testing';
import { take } from 'rxjs';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let scheduler: TestScheduler;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogComponent],
      providers: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('DialogComponent title', () => {
    it('should have title if title is provided', () => {
      const dialogOptions = mockDialogData.mockConfirmDialogConfig;
      const dialog = component.openDialog(dialogOptions, fixture.componentRef.hostView);
      fixture.detectChanges();
      const hostElement = fixture.debugElement.nativeElement as HTMLElement;
      const title = (hostElement.querySelector('.dialog-title') as HTMLElement);
      expect(title).toBeTruthy();
      expect(title.innerText.toLocaleLowerCase()).toEqual(dialogOptions.title.toLocaleLowerCase());
    });
  });

  describe('DialogComponent message', () => {
    let dialogOptions: TConfirmDialog;
    beforeEach(() => {
      dialogOptions = mockDialogData.mockConfirmDialogConfig;
    })
    it('should have message if message is provided', () => {
      const dialog = component.openDialog(dialogOptions, fixture.componentRef.hostView);
      fixture.detectChanges();
      const hostElement = fixture.debugElement.nativeElement as HTMLElement;
      const message = (hostElement.querySelector('.dialog-message') as HTMLElement);
      expect(message).toBeTruthy();
    });

  });

  describe('DialogComponent buttons', () => {
    let dialogOptions: TConfirmDialog;
    beforeEach(() => {
      dialogOptions = mockDialogData.mockConfirmDialogConfig;
    });
    it('should have close button if canClose is true', () => {
      dialogOptions.canClose = true;
      const dialog = component.openDialog(dialogOptions, fixture.componentRef.hostView);
      fixture.detectChanges();
      const hostElement = fixture.debugElement.nativeElement as HTMLElement;
      const closebutton = (hostElement.querySelector('.dialog-close') as HTMLElement);
      expect(closebutton).toBeTruthy();
    });

    it('should have configured buttons if buttonOptions are provided', () => {
      const dialog = component.openDialog(dialogOptions, fixture.componentRef.hostView);
      fixture.detectChanges();
      const hostElement = fixture.debugElement.nativeElement as HTMLElement;
      const buttons = (hostElement.querySelectorAll('.dialog-button') as NodeListOf<HTMLElement>);
      expect(buttons.length).toEqual(dialogOptions.buttonOptions.length);
    });
  });

  describe('DialogComponent result', () => {
    let dialogOptions:any;
    beforeEach(() => {
      
      dialogOptions = mockDialogData.mockConfirmDialogConfig;
    })
    it ('onOpen should emit on dialog open', (done: DoneFn) => {
      component.onOpen().pipe(take(1)).subscribe(() => {
        expect(component.hostView).toBeTruthy();
        done();
      });
      component.openDialog(dialogOptions, fixture.componentRef.hostView);
    });

    it ('onClose should emit on button click event and destroy host view', (done: DoneFn) => {
      component.openDialog(dialogOptions, fixture.componentRef.hostView);
      const hostViewDestroySpy = spyOn(component.hostView, 'destroy');
      fixture.detectChanges();
      const hostElement = fixture.debugElement.nativeElement as HTMLElement;
      const targetButton = (hostElement.querySelector('.dialog-button') as HTMLElement);
      component.onClose().pipe(take(1)).subscribe((result) => {
        expect(result).toEqual(dialogOptions.buttonOptions[0]);
        expect(hostViewDestroySpy).toHaveBeenCalled();
        done();
      });
      targetButton.click();


    });

    it ('onCancel should emit on dialog close and destroy host view', (done: DoneFn) => {
      const dialog = component.openDialog(dialogOptions, fixture.componentRef.hostView);
      const hostViewDestroySpy = spyOn(component.hostView, 'destroy');
      fixture.detectChanges();
      const hostElement = fixture.debugElement.nativeElement as HTMLElement;
      const closeButton = (hostElement.querySelector('.dialog-close') as HTMLElement);
      dialog.onCancel().pipe(take(1)).subscribe(() => {
        expect(hostViewDestroySpy).toHaveBeenCalled();
        done();
      });
      closeButton.click();
  })
});


  describe('DialogComponent closeAfter', () => {
    it('should show timer message if showTimer is true', () => {
      const dialogOptions = mockDialogData.mockConfirmDialogConfig;
      const closeAfter = 5000;
      const dialog = component.openDialog(dialogOptions, fixture.componentRef.hostView, closeAfter, true);
      fixture.detectChanges();
      const hostElement = fixture.debugElement.nativeElement as HTMLElement;
      const timerMessage = (hostElement.querySelector('.dialog-timer-message') as HTMLElement);
      expect(timerMessage).toBeTruthy();
    });
  });

  it ('should close dialog after specified time', (done: DoneFn) => {
    const dialogOptions = mockDialogData.mockConfirmDialogConfig;
    const closeAfter = 1000;
    const dialog = component.openDialog(dialogOptions, fixture.componentRef.hostView, closeAfter);
    fixture.detectChanges();
    const hostDestroySpy = spyOn(component.hostView, 'destroy');
    setTimeout(() => {
      expect(hostDestroySpy).toHaveBeenCalled();
      done();
    }, closeAfter+1000);
  });

    
});
