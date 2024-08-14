import type * as CSS from 'csstype';
import { Observable } from 'rxjs';

export type TDialogType = string & ('acknowledge' | 'confirm' | 'choice' | 'alert'); 
export type TDialog = {
    dialogType?: TDialogType;
    title?: string;
    message?: Observable<string | null> | string | null;
    stylingOptions?: CSS.Properties
    buttonStylingOptions?: CSS.Properties
    animationDelay?: number;
    animationDuration?: number;
    buttonOptions?: string[] | [string, string] | [string];
    canClose?: boolean;
    closeAfter?: number;
    showTimer?: boolean;
}

export type TChoiceDialog = Pick<TDialog, Exclude<keyof TDialog, 'showTimer'| 'closeAfter'| 'canClose'>>  & {
    buttonOptions: string[];
    canClose?: boolean;

}
export type TConfirmDialog = Pick<TDialog, Exclude<keyof TDialog, 'closeAfter' | 'showTimer' | 'canClose'>>  & {
    buttonOptions: [string, string];
}

export type TAcknowledgeDialog = Pick<TDialog, Exclude<keyof TDialog,  'closeAfter' | 'canClose' | 'showTimer'>> & {
    buttonOptions: [string];
}

export type TAlertDialog = Pick<TDialog, Exclude<keyof TDialog, 'canClose' | 'buttonOptions'>> & {
    closeAfter?: number;
    showTimer?: boolean;
}

export type TDialogConfig<T extends TDialogType> = (T extends 'acknowledge' ? TAcknowledgeDialog : T extends 'confirm' ? TConfirmDialog : T extends 'choice' ? TChoiceDialog : TAlertDialog )



  