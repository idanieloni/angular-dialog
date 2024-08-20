import { createComponent, createEnvironmentInjector, EnvironmentInjector, Injectable, InjectionToken, Provider, ViewContainerRef, ViewRef } from '@angular/core';
import { TAcknowledgeDialog, TAlertDialog, TChoiceDialog, TConfirmDialog, TDialog, TDialogConfig, TDialogType } from '../../types';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { combineLatest, merge, pipe, take, throwError } from 'rxjs';
import { DIALOG_CONFIG } from '../../core/injection-tokens';


@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private currentDialog: ViewRef | null = null;
  /**
   * Constructor for DialogService
   * @param _parentInjector - The parent environment injector
   * @param _vcr - The view container reference
   */
  constructor(
       private _parentInjector: EnvironmentInjector,
       private _vcr: ViewContainerRef
    ) {}

  /**
   * Opens a dialog with the given options.
   * @param dialogOptions - The options for the dialog
   * @returns The instance of the opened dialog
   */
  private openDialog<T extends TDialogType>(dialogOptions: TDialogConfig<T>) { 
      if (!!this.currentDialog) {
        return{
          onOpen: () => throwError( () => new Error('Dialog already open')),
          onClose: () => throwError( () => new Error('Dialog already open')),
          onCancel: () => throwError( () => new Error('Dialog already open')),
        }
      }
      const dialogConfigProvider = this.createConfigInjectionToken(dialogOptions);
      const environmentInjector = createEnvironmentInjector([dialogConfigProvider, {provide: ViewContainerRef, useValue: this._vcr}], this._parentInjector);
      const dialogComp = this._vcr.createComponent(DialogComponent, { environmentInjector: environmentInjector });  
      
      const hostViewRef = this._vcr.insert(dialogComp.hostView);
      this.currentDialog = hostViewRef;
      merge(dialogComp.instance.$.onCancel(), dialogComp.instance.$.onClose()).pipe(take(1)).subscribe(() => {
        this._vcr.detach(this._vcr.indexOf(hostViewRef));
        this.currentDialog = null;
      })
      return dialogComp.instance.$
  }

  /**
   * Opens a confirm dialog with the given options.
   * @param dialogOptions - The options for the confirm dialog
   * @returns An object with methods to handle dialog events
   */
  openConfirmDialog(dialogOptions: TConfirmDialog) {
    dialogOptions.buttonOptions = dialogOptions.buttonOptions || ['Yes', 'No']; 
    dialogOptions.dialogType = 'confirm';
    const dialog = this.openDialog<'confirm'>(dialogOptions);
    return {
      onOpen: () => dialog.onOpen(),
      onConfirm:() => dialog.onClose(),
      onReject: () => dialog.onCancel()
    }
  }

  /**
   * Opens an acknowledge dialog with the given options.
   * @param dialogOptions - The options for the acknowledge dialog
   * @returns An object with methods to handle dialog events
   */
  openAcknowledgeDialog(dialogOptions: TAcknowledgeDialog) {
    dialogOptions.buttonOptions = dialogOptions.buttonOptions || ['OK'];
    dialogOptions.dialogType = 'acknowledge';
    const dialog = this.openDialog<'acknowledge'>(dialogOptions);
    return {
      onAcknowledge: () => dialog.onClose(),
      onOpen: () => dialog.onOpen()
    }
  }

  /**
   * Opens a choice dialog with the given options.
   * @param dialogOptions - The options for the choice dialog
   * @returns An object with methods to handle dialog events
   */
  openChoiceDialog(dialogOptions: TChoiceDialog) {
    dialogOptions.buttonOptions = dialogOptions.buttonOptions || ['Yes', 'No', 'Skip'];
    dialogOptions.dialogType = 'choice';
    const dialog = this.openDialog<'choice'>(dialogOptions);
    return {
      onOpen: () => dialog.onOpen(),
      onChoice: () => dialog.onClose(),
      onCancel: () => dialog.onCancel()
    }
  }

  /**
   * Opens an alert dialog with the given options.
   * @param dialogOptions - The options for the alert dialog
   * @returns An object with methods to handle dialog events
   */

  openAlertDialog(dialogOptions: TAlertDialog) {    
    dialogOptions.dialogType = 'alert';
    const dialog = this.openDialog<'alert'>(dialogOptions);
    return {
      onOpen: () => dialog.onOpen(),
      onClose: () => merge(dialog.onClose(), dialog.onCancel())
    }
  }

  /**
   * Creates a provider for the DIALOG_CONFIG
   * @param dialogConfig - The dialog configuration
   * @returns A provider for the dialog configuration
   */
  createConfigInjectionToken(dialogConfig: any): Provider {
    return {
      provide: DIALOG_CONFIG,
      useValue: {...dialogConfig}
    }
  }
}


  