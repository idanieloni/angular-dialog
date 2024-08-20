import { TestBed } from '@angular/core/testing';
import { DialogService } from './dialog.service';
import { mockDialogData } from '../../testing/mock-data';
import { EnvironmentInjector, ViewContainerRef } from '@angular/core';
import { MockTokens } from '../../testing/providers/injectibles.providers';
import { DIALOG_CONFIG } from '../../core/injection-tokens';
import { catchError, combineLatest, map, Observable, of, Subject, take } from 'rxjs';

describe('DialogService', () => {
  let dialogService: DialogService;
  let viewContainerRefMock: ViewContainerRef;
  let environmentInjectorMock: EnvironmentInjector;
  let onCloseSubject: Subject<any>;
  let onCancelSubject: Subject<any>;
  let onOpenSubject: Subject<any>;

  beforeEach(async () => {
    onCloseSubject = new Subject<any>();
    onCancelSubject = new Subject<any>();
    onOpenSubject = new Subject<any>();

    // Mocking the view container ref and environment injector
    viewContainerRefMock = MockTokens.mockViewContainerRef({
      instance: {
        $: {
          onClose: () => onCloseSubject,
          onCancel: () => onCancelSubject,
          onOpen: () => onOpenSubject,
        }
      },
      // Mocking the host view ref so that its is not falsy
      hostViewRef: {
        destroyed: false
      }
    }).Object;

    environmentInjectorMock = MockTokens.mockEnvironmentInjector().Object;

    TestBed.configureTestingModule({
      providers: [
        DialogService,
        { provide: EnvironmentInjector, useValue: environmentInjectorMock },
        { provide: ViewContainerRef, useValue: viewContainerRefMock },
        { provide: DIALOG_CONFIG, useValue: mockDialogData.mockConfirmDialogConfig },
      ],
    }).compileComponents();

    dialogService = TestBed.inject(DialogService);

  });

  it('should be created', () => {
    expect(dialogService).toBeTruthy();
  });

  describe('Opening dialog', () => {
    it('confirm dialog should return appropriate observables', () => {
      const dialog = dialogService.openConfirmDialog(mockDialogData.mockConfirmDialogConfig);

      expect(dialog.onOpen).toBeDefined();
      expect(dialog.onConfirm).toBeDefined();
      expect(dialog.onReject).toBeDefined();
    });

    it('choice dialog should return appropriate observables', () => {
      const dialog = dialogService.openChoiceDialog(mockDialogData.mockChoiceDialogConfig);

      expect(dialog.onOpen).toBeDefined();
      expect(dialog.onChoice).toBeDefined();
      expect(dialog.onCancel).toBeDefined();
    });

    it('alert dialog should return appropriate observables', () => {
      const dialog = dialogService.openAlertDialog(mockDialogData.mockAlertDialogConfig);

      expect(dialog.onOpen).toBeDefined();
      expect(dialog.onClose).toBeDefined();
    });

    it('acknowledge dialog should return appropriate observables', () => {
      const dialog = dialogService.openAcknowledgeDialog(mockDialogData.mockAknowledgementDialogConfig);

      expect(dialog.onOpen).toBeDefined();
      expect(dialog.onAcknowledge).toBeDefined();
    });

    it('should not alow opening multiple dialogs and throw error observables', (done: DoneFn) => {
      dialogService.openChoiceDialog(mockDialogData.mockChoiceDialogConfig);
      const dialog2 = dialogService.openConfirmDialog(mockDialogData.mockConfirmDialogConfig);

      // Should not open another dialog
      expect(viewContainerRefMock.insert).toHaveBeenCalledTimes(1);
      combineLatest([
        dialog2.onOpen().pipe(take(1), catchError(() => of('open  error'))),
        dialog2.onConfirm().pipe(take(1), catchError(() => of('close error'))),
        dialog2.onReject().pipe(take(1), catchError(() => of('cancel error'))),
      ])
        .subscribe(([openError, closeError, cancelError]) => {
          expect(openError).toEqual('open  error');
          expect(closeError).toEqual('close error');
          expect(cancelError).toEqual('cancel error');
          done();
        });
    });
  });

  describe('Closing Dialog', () => {
    beforeEach(() => {
      dialogService.openConfirmDialog(mockDialogData.mockConfirmDialogConfig);
      // Trigger the close event
      onCloseSubject.next('');
    });
    it('should detach the dialog component when dialog closed/cancelled', () => {
      expect(viewContainerRefMock.detach).toHaveBeenCalled()

    });
    it('should be able to open another dialog', () => {
      dialogService.openConfirmDialog(mockDialogData.mockConfirmDialogConfig);
      expect(viewContainerRefMock.insert).toHaveBeenCalledTimes(2);
    });
  });
});
