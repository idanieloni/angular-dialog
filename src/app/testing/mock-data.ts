
const mockAlertDialogConfig = {
    title: 'Alert Dialog',
    message: 'This is an Alert Dialog.',
    buttonOptions: ['OK'],
};

const mockAknowledgementDialogConfig = {
    title: 'Aknowledgement Dialog',
    message: 'This is an Aknowledgement Dialog.',
    buttonOptions: ['OK'] as [string],

};
const mockConfirmDialogConfig = {
    title: 'Confirm Dialog',
    message: 'This is a Confirmation Dialog.',
    canClose: true,
    buttonOptions: ['Yes', 'No'] as [string, string],

};

const mockChoiceDialogConfig = {
    title: 'Choice Dialog',
    message: 'This is a Choice Dialog.',
    canClose: true,
    buttonOptions: ['OK', 'Skip', 'Cancel'] as string[],
};


export const mockDialogData ={
    mockAlertDialogConfig,
    mockConfirmDialogConfig,
    mockChoiceDialogConfig,
    mockAknowledgementDialogConfig
}

