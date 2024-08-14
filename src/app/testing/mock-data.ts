import { TAcknowledgeDialog, TAlertDialog, TChoiceDialog, TConfirmDialog } from "../types";

const mockAlertDialogConfig: TAlertDialog = {
    title: 'Alert Dialog',
    message: 'This is an Alert Dialog.',
    closeAfter: 1000,
    showTimer: true,
};

const mockAknowledgementDialogConfig: TAcknowledgeDialog = {
    title: 'Aknowledgement Dialog',
    message: 'This is an Aknowledgement Dialog.',
    buttonOptions: ['OK'] as [string],

};
const mockConfirmDialogConfig: TConfirmDialog = {
    title: 'Confirm Dialog',
    message: 'This is a Confirmation Dialog.',
    buttonOptions: ['Yes', 'No'] as [string, string],

};

const mockChoiceDialogConfig: TChoiceDialog = {
    title: 'Choice Dialog',
    message: 'This is a Choice Dialog.',
    canClose: true,
    buttonOptions: ['OK', 'Skip', 'Cancel'] as string[],
};


export const mockDialogData ={
    mockAlertDialogConfig,
    mockConfirmDialogConfig,
    mockChoiceDialogConfig,
    mockAknowledgementDialogConfig,
}

