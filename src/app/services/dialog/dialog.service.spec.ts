import { TestBed } from '@angular/core/testing';
import { DialogService } from './dialog.service';
import { mockDialogData } from '../../testing/mock-data';
import { EnvironmentInjector, ViewContainerRef } from '@angular/core';
import { MockTokens } from '../../testing/providers/injectibles.providers';
import { MockServices } from '../../testing/providers/services.providers';

describe('DialogService', () => {
  let dialogService: DialogService;
  let viewContainerRefMock: ViewContainerRef;
  let environmentInjectorMock: EnvironmentInjector;

  beforeEach(() => {
    viewContainerRefMock = MockTokens.mockViewContainerRef().Object;
    environmentInjectorMock = MockTokens.mockEnvironmentInjector().Object;

    TestBed.configureTestingModule({
      providers: [
        DialogService,
        { provide: EnvironmentInjector, useValue: environmentInjectorMock },
        { provide: ViewContainerRef, useValue: viewContainerRefMock },
      ],
    });
    
    dialogService = TestBed.inject(DialogService);

  });

  describe('opening dialog', () => {
    it('should detach existing dialog if it already exists', () => {
      const dialogOptions = mockDialogData.mockConfirmDialogConfig;
      dialogService.openConfirmDialog(dialogOptions);
      expect(viewContainerRefMock.indexOf).toHaveBeenCalled();
      expect(viewContainerRefMock.get).toHaveBeenCalled();
      expect(viewContainerRefMock.detach).toHaveBeenCalled()
     
    });

    it('should open a confirm dialog', () => {
      const dialogOptions = mockDialogData.mockConfirmDialogConfig;
      const dialog = dialogService.openConfirmDialog(dialogOptions);

      expect(viewContainerRefMock.insert).toHaveBeenCalled();
      expect(dialog.onOpen).toBeDefined();
      expect(dialog.onConfirm).toBeDefined();
      expect(dialog.onReject).toBeDefined();
    });

    it('should open a confirm dialog', () => {
      const dialogOptions = mockDialogData.mockConfirmDialogConfig;
      const dialog = dialogService.openConfirmDialog(dialogOptions);

      expect(dialog.onOpen).toBeDefined();
      expect(dialog.onConfirm).toBeDefined();
      expect(dialog.onReject).toBeDefined();
    });

    it('should open a confirm dialog', () => {
      const dialogOptions = mockDialogData.mockConfirmDialogConfig;
      const dialog = dialogService.openConfirmDialog(dialogOptions);

      expect(dialog.onOpen).toBeDefined();
      expect(dialog.onConfirm).toBeDefined();
      expect(dialog.onReject).toBeDefined();
    });

    it('should open a choice dialog', () => {
      const dialogOptions = mockDialogData.mockChoiceDialogConfig;
      const dialog = dialogService.openChoiceDialog(dialogOptions);

      expect(dialog.onOpen).toBeDefined();
      expect(dialog.onChoice).toBeDefined();
      expect(dialog.onCancel).toBeDefined();
    });

    it('should open an alert dialog', () => {
        const dialogOptions = mockDialogData.mockAlertDialogConfig;
        const dialog = dialogService.openAlertDialog(dialogOptions);
        
        expect(dialog.onOpen).toBeDefined();
        expect(dialog.onClose).toBeDefined();
    });
  });
});
