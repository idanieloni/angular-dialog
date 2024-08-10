import type * as CSS from 'csstype';
import { IDialog } from '../interfaces';
import { Observable } from 'rxjs';
export type TDialog = Partial<Pick<IDialog, Exclude<keyof IDialog, 'onClose' | 'onCancel' | 'onOpen' | 'message'>>> &{
    message: string | null | Observable<string | null>;
};


export type TChoiceDialog = TDialog & {
    buttonOptions: string[];
}
export type TConfirmDialog = TDialog & {
    buttonOptions: [string, string];
}

export type TAcknowledgeDialog = TDialog & {
    buttonOptions: [string];
}

export type TAlertDialog = Pick<TDialog, Exclude<keyof TDialog, 'canClose' | 'buttonOptions'>> & {
    closeAfter?: number;
    showTimer?: boolean;
}

