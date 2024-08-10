import { Observable } from "rxjs";
import type * as CSS from 'csstype';

export interface IDialog {
    title: string;
    message: Observable<string | null>;
    stylingOptions: CSS.Properties
    buttonStylingOptions: CSS.Properties
    canClose: boolean;
    buttonOptions: string[]
    animationDelay: number;
    animationDuration: number;    
    
    onClose: () => Observable<any>;
    onCancel: () => Observable<any>;
    onOpen: () => Observable<any>;

}