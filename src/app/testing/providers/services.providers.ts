import { Mock } from "ts-mocks";
import { DialogService } from "../../services/dialog/dialog.service";
import { of } from "rxjs";
import { TAcknowledgeDialog, TChoiceDialog, TConfirmDialog } from "../../types/common.types";

export class MockServices<T> extends Mock<T> {
    provider: { provide: {}, useValue: T };
    
    static mockDialogService(): MockServices<DialogService> {
        const mock = new MockServices<DialogService>(
            {
            openConfirmDialog: (dialogOptions: TConfirmDialog) => ({
                onOpen: () => of(),
                onConfirm: () => of(''),
                onReject: () => of()
            }),
            openAcknowledgeDialog: (dialogOptions: TAcknowledgeDialog) => ({
                onOpen: () => of(),
                onAcknowledge: () => of()
            }),
            openChoiceDialog: (dialogOptions: TChoiceDialog) => ({
                onOpen: () => of(),
                onChoice: () => of(''),
                onCancel: () => of()
            }),
            openAlertDialog: (dialogOptions: TAcknowledgeDialog) => ({
                onOpen: () => of(),
                onClose: () => of()
            })
        });
        mock.provider = { 
            provide: DialogService, useValue: mock.Object 
        }
        return mock;
      }
}   