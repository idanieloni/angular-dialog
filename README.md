## Welcome to the Dialog wiki!
### Table of Contents  
[Requirements](#requirements)

[Installation](#installation)  

[Usage Notes](#usage)  

[Styling](#styling)


<a name="requirements"/>

## Requirements
####The following packages are required for Dialog Serivice and Component:
	"csstype": "^3.1.3",
	"@angular/core"
####For testing:
	"@types/jasmine": "~5.1.0",
	"@types/jasminewd2": "^2.0.13",
	"@types/karma": "^6.3.8",
	"@types/karma-junit-reporter": "^2.0.4",
	"jasmine": "^5.2.0",
	"jasmine-core": "~5.1.0",
	"jasmine-spec-reporter": "^7.0.0",
	"karma": "~6.4.0",
	"karma-chrome-launcher": "~3.2.0",
	"karma-coverage": "~2.2.0",
	"karma-coverage-istanbul-reporter": "^3.0.3",
	"karma-firefox-launcher": "^2.1.3",
	"karma-jasmine": "~5.1.0",
	"karma-jasmine-html-reporter": "~2.1.0",
	"karma-parallel": "^0.3.1",
	"karma-phantomjs-launcher": "^1.0.4",
	"puppeteer": "^23.0.1",
	"ts-mocks": "^3.0.1",

<a name="installation"/>

## Installation
> git clone https://github.com/idanieloni/dialog.git


<a name="usage"/>

## Usage Notes
### Dialog service
**!Important**: Dialog Service must be configured as provider for application. 
#### Common Parameters for dialogOptions:
       title: string - title for the dialog (optional)
		message: string | null | Observable<string | null> - the message to be displayed. 
		stylingOptions: CSS.Properties - css styling properties for the dialog-box (optional, defualts are
			color: 'black', 
			backgroundColor: 'white',
			border: '1px solid black')
		buttonStylingOptions: CSS.Properties - css stling properties for the dialog choice buttons (optional)
		animationDelay: number - the dialog box animation delay (optional, default: 500, measured in ms) 
		animationDuration: number - the dialog box animation duration (optional, default: 1000, measured in ms

<br/>
#### openConfirmDialog(dialogOptions):

Opens a dialog with an option to confirm or reject a message. **This type of dialog is not closeable.**

    Additional Parameters:
		buttonOptions: [string, string]; - confirm(button 1) and reject(button 2) (optional, defaults are 'Yes' and 'No')
		canClose: boolean - show a close button that invokes onCancel. (optional, default is false)
				 
	Returns:
		onOpen(): Invoked when dialog is opened.
		onConfirm: Invoked when button confirm button is clicked
		onReject: Invoked when reject button  is clicked

#### openAcknowledgeDialog(dialogOptions):
Opens a dialog to acknowledge a message. **This type of dialog is not closeable.**

    Additional Parameters:
        buttonOptions: [string] - acknowledgement button. (optional, default is 'OK';
        
    Returns: An object with methods to handle dialog events:
		onOpen(): Invoked when dialog is opened.
		onAcknowledge(): Invoked when the acknowledgment is received.

#### openChoiceDialog(dialogOptions)
Opens a dialog with n number of choices. **This type of dialog is optionally closeable.** 

    Additional Parameters:
        buttonOptions: string[] - n number of buttons as choices for the dialog (optional, defaults are 'Yes', 'No', 'Skip')
        canClose: boolean - show a close button that invokes onCancel. (optional, default is false)

    Returns: An object with methods to handle dialog events:
        onOpen(): Invoked when dialog is opened.
        onChoice(): Invoked when a choice is made.
        onCancel(): Invoked if the dialog is canceled/ closed without a choice.

#### openAlertDialog(dialogOptions)
Opens an alert dialog. **This type of dialog is always closeable**. 

    Additional Parameters:
    	closeAfter: number  - timeout before alert closes. (optional) 
    	showTimer: boolean - show the countdown till alert closes. (optional) 
        

    Returns: An object with methods to handle dialog events:
        onOpen(): Invoked when the dialog opens.
        onClose(): Invoked when the dialog is closed.

<a name="styling"/>

## Styling 
### Styling Classes
The following are the classes that apply to elements of the dialog:
	
	.dialog-ct - the dialog-box container
		.dialog-header - the dialog header
			.dialog-title - the dialog title 
			.dialog-close - the dialog close button( when available)
		.dialog-message-ct - the message box
			.dialog-message
			.dialog-timer-message
		.dialog-buttons-ct
			.dialog-button
	


