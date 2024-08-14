import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogComponent } from './dialog.component';
import { mockDialogData } from '../../testing/mock-data';
import { take } from 'rxjs';
import { DIALOG_CONFIG } from '../../core/injectibes';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  let mockChoiceDialogConfig = { ...mockDialogData.mockConfirmDialogConfig, dialogType: 'choice' };
  let mockAlertDialogConfig = { ...mockDialogData.mockAlertDialogConfig, dialogType: 'alert' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogComponent],
    })
  });


  it('should create', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DIALOG_CONFIG, useValue: mockChoiceDialogConfig }
      ]
    })
    TestBed.compileComponents();
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('DialogComponent view', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule(
        {
          providers: [
            { provide: DIALOG_CONFIG, useValue: mockChoiceDialogConfig }
          ]
        });
      TestBed.compileComponents();
      fixture = TestBed.createComponent(DialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    afterAll(() => {
      fixture.destroy();
    });

    it('should have title if title is provided', () => {
      const hostElement = fixture.debugElement.nativeElement as HTMLElement;
      const title = (hostElement.querySelector('.dialog-title') as HTMLElement);
      expect(title).toBeTruthy();
      expect(title.innerText.toLocaleLowerCase()).toEqual(mockChoiceDialogConfig.title!.toLocaleLowerCase());
    });

    it('should have message if message is provided', () => {
      const hostElement = fixture.debugElement.nativeElement as HTMLElement;
      const message = (hostElement.querySelector('.dialog-message') as HTMLElement);
      expect(message).toBeTruthy();
    });

    it('should have close button if canClose is true', () => {
      const hostElement = fixture.debugElement.nativeElement as HTMLElement;
      const closebutton = (hostElement.querySelector('.dialog-close') as HTMLElement);
      expect(closebutton).toBeTruthy();
    });

    it('should have configured buttons if buttonOptions are provided', () => {
      const hostElement = fixture.debugElement.nativeElement as HTMLElement;
      const buttons = (hostElement.querySelectorAll('.dialog-button') as NodeListOf<HTMLElement>);
      expect(buttons.length).toEqual(mockChoiceDialogConfig.buttonOptions.length);
    });
  });
  describe('DialogComponent result', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule(
        {
          providers: [
            { provide: DIALOG_CONFIG, useValue: mockChoiceDialogConfig }
          ]
        });
      TestBed.compileComponents();
      fixture = TestBed.createComponent(DialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    afterAll(() => {
      fixture.destroy();
    })
    it('onOpen should emit on dialog open', (done: DoneFn) => {
      component.$.onOpen().pipe(take(1)).subscribe(() => {
        expect(fixture.debugElement.nativeElement).toBeTruthy();
        done();
      });
    });

    it('onClose should emit on button click event', (done: DoneFn) => {
      const hostElement = fixture.debugElement.nativeElement as HTMLElement;
      const targetButton = (hostElement.querySelector('.dialog-button') as HTMLElement);
      component.$.onClose().pipe(take(1)).subscribe((result) => {
        expect(result).toEqual(mockChoiceDialogConfig.buttonOptions[0]);
        done();
      });
      targetButton.click();
    });

    it('onCancel should emit on dialog close', (done: DoneFn) => {
      const fixtureEl = fixture.debugElement.nativeElement as HTMLElement;
      const closeButton = (fixtureEl.querySelector('.dialog-close') as HTMLElement);
      component.$.onCancel().pipe(take(1)).subscribe((res) => {
        expect(res).toBeUndefined();
        done();
      });
      closeButton.click();
    })
  });


  describe('Alert Dialog', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule(
        {
          providers: [
            { provide: DIALOG_CONFIG, useValue: mockAlertDialogConfig }
          ]
        });
      TestBed.compileComponents();
      fixture = TestBed.createComponent(DialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should show timer message if showTimer is true', () => {
      fixture.detectChanges();
      const hostElement = fixture.debugElement.nativeElement as HTMLElement;
      const timerMessage = (hostElement.querySelector('.dialog-timer-message') as HTMLElement);
      expect(timerMessage).toBeTruthy();
    });


    it('alert dialog should close dialog after specified time', (done: DoneFn) => {
      const c = component
      component.$.onClose().pipe(take(1)).subscribe((res) => {
        expect(res).toBeUndefined();
        done();
      });
    });
  });
});
