import { InjectionToken } from "@angular/core";
import { TDialog, TConfirmDialog, TAcknowledgeDialog, TDialogType } from "../types";

export const  DIALOG_CONFIG = new InjectionToken<
  (TDialog | TConfirmDialog | TAcknowledgeDialog) & { dialogType: TDialogType }
  >('DIALOG_CONFIG');