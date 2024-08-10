import { createComponent, createEnvironmentInjector, EnvironmentInjector, Injectable, Injector, runInInjectionContext, ViewContainerRef } from '@angular/core';
import { TAcknowledgeDialog, TAlertDialog, TChoiceDialog, TConfirmDialog, TDialog } from '../../types/common.types';
import { DialogComponent } from '../../components/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private envInjector: EnvironmentInjector 
  constructor(
       private _parentInjector: EnvironmentInjector,
       private _vcr: ViewContainerRef
      
    ) {}

  private openDialog(dialogOptions: TDialog | TConfirmDialog | TAcknowledgeDialog, closeAfter?: number, showtimer?: boolean) {  
    
      const dialogComp = createComponent(DialogComponent, { environmentInjector: this._parentInjector });
      if (this._vcr.get(this._vcr.indexOf(dialogComp.hostView))) {        
        this._vcr.detach(this._vcr.indexOf(dialogComp.hostView));
      }
      const hostViewRef = this._vcr.insert(dialogComp.hostView);
      return dialogComp.instance.openDialog(dialogOptions, hostViewRef, closeAfter!, showtimer!);
  }

  openConfirmDialog(dialogOptions: TConfirmDialog) {
    const dialog = this.openDialog(dialogOptions);
    return {
      onOpen: () => dialog.onOpen(),
      onConfirm:() => dialog.onClose(),
      onReject: () => dialog.onCancel()
    }
  }

  openAcknowledgeDialog(dialogOptions: TAcknowledgeDialog) {
    dialogOptions.canClose = dialogOptions.canClose || false
    const dialog = this.openDialog(dialogOptions);
    return {
      onAcknowledge: () => dialog.onClose(),
      onOpen: () => dialog.onOpen()
    }
  }

  openChoiceDialog(dialogOptions: TChoiceDialog) {
    const dialog = this.openDialog(dialogOptions);
    return {
      onOpen: () => dialog.onOpen(),
      onChoice: () => dialog.onClose(),
      onCancel: () => dialog.onCancel()
    }
  } 

  openAlertDialog(dialogOptions: TAlertDialog) {
    console.log('openAlertDialog');
    
    const dialog = this.openDialog(({...dialogOptions, canClose: true}), dialogOptions.closeAfter, dialogOptions.showTimer);    
    return {
      onOpen: () => dialog.onOpen(),
      onClose: () => dialog.onClose()
    }
  }

}
