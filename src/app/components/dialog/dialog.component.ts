import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, ViewChild } from '@angular/core';
import { from, Observable, Subject } from 'rxjs';
import { DIALOG_CONFIG } from '../../core/injectibes';
import { TDialog } from '../../types';

/**
 * Represents a dialog component that can be used to display messages and gather user input.
 * This component implements the IDialog and AfterViewInit interfaces.
 *  @implements IDialogConfig, AfterViewInit
 *  @constructor DialogComponent
 */

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  host: { 'class': 'app-dialog' },
})

export class DialogComponent implements AfterViewInit {
  public dialogId: number;
  protected config: TDialog = {} as TDialog;
  private defualtConfig: Partial<TDialog> = {
    stylingOptions: {
      color: 'black',
      backgroundColor: 'white',
      border: '1px solid black',
    },
    buttonStylingOptions: {
      color: 'black',
      backgroundColor: 'white',
    },
    animationDelay: 300,
    animationDuration: 300,
    buttonOptions: ['Ok'],
    canClose: false,
    closeAfter: undefined,
    showTimer: false,
  }
  protected timer: Observable<number>;

  private result = new EventEmitter<string | null>();
  private opened = new EventEmitter<void>();
  private cancelled = new EventEmitter<void>();


  @ViewChild('dialogCt') private dialogCt: ElementRef<HTMLDivElement>;

  constructor(
    @Inject(DIALOG_CONFIG) config: TDialog,
    private _cdr: ChangeDetectorRef,
  ) {
    this.setProperties(config);

  }
  ngAfterViewInit(): void {
    this._cdr.detectChanges();    
    this.animateDialog('in').finished.then(() => {
      this.opened.emit();
      this.dialogCt.nativeElement.focus();
    })
  }

  /**
   * Sets the properties of the dialog component from the configuration object. If a property is not provided, the default value is used.
   * @param {IDialogConfig} config - The configuration object for the dialog component.
   * @memberof DialogComponent
   **/
  private setProperties(config: TDialog) {
    const isObject = (val: any): boolean => {
      return val && typeof val === 'object' && !Array.isArray(val);
    };
    const mergeDefaults = (obj1: Record<string, any>, obj2: Record<string, any>): Record<string, any> => {
      return Object.keys({ ...obj1, ...obj2 }).reduce((acc, key) => {
        const val1 = obj1[key];
        const val2 = obj2[key];

        if (isObject(val1) && isObject(val2)) {
          (acc as any)[key] = mergeDefaults(val1, val2);
        } else {
          (acc as any)[key] = val1 !== undefined ? val1 : val2;
        }
        return acc;
      }, {} as TDialog);
    };
    this.config = mergeDefaults(config, this.defualtConfig,) as TDialog;
    if (this.config.closeAfter) { this.timer = this.countdown(this.config.closeAfter) };
  }

  /**
   * Animates the dialog component.
   * @param {'in' | 'out'} direction - The direction to animate the dialog component.
   * @returns {Animation} - The animation object.
   * @memberof DialogComponent
  **/
  private animateDialog(direction: 'in' | 'out'): Animation {
    const animationOptions: KeyframeAnimationOptions = {
      duration: this.config.animationDuration,
      delay: this.config.animationDelay,
      fill: 'forwards',
      easing: 'ease-in-out',
    };

    const animationKeyframes: Keyframe[] = direction === 'in'
      ? [{ opacity: 0, transform: 'scale(0.5)' }, { opacity: 1, transform: 'scale(1)' }]
      : [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.5)' }];

    return this.dialogCt.nativeElement.animate(animationKeyframes, animationOptions);
  }

  /**
   * Returns an observable that emits a countdown.
   * @param {number} count - The time in milliseconds to countdown from.
   * @returns {Observable<number>} - An observable that emits a countdown.
   * @memberof DialogComponent
   **/

  private countdown(count: number): Observable<number> {
    const countdownSubject = new Subject<number>();
    let countdownValue = count / 1000;

    const interval = setInterval(() => {
      countdownSubject.next(countdownValue);
      countdownValue--;

      if (countdownValue < 0) {
        clearInterval(interval);
        countdownSubject.complete();
        this.closeDialog().then(() => this.result.emit());
      }
    }, 1000);

    return countdownSubject.asObservable();
  }

  /**
   * Emits a result when a button is clicked and closes dialog.
   * @param {Event | string} event - The event or string to emit.
   * @returns {void}
   * @memberof DialogComponent
   **/
  protected emitResult(event?: Event | string): void {
    let result: string | null = '';
    if (this.config.dialogType === 'alert') {
      this.closeDialog().then(() => this.result.emit())
      return;
    }

    if (event instanceof Event) {
      const target = event.target as HTMLButtonElement;
      if (target.classList.contains('dialog-close')) {
        this.cancelDialog();
        return;
      }
      result = target.innerText;
    } else {
      result = event!;
    }
    if (['cancel', 'close'].includes(result!.toLowerCase())) {
      this.cancelDialog();
      return;
    }
    this.closeDialog().then(() => this.result.emit(result))
  }

  /**
   * Closes the dialog component and emits a cancelled event.
   * @memberof DialogComponent
   * */
  protected cancelDialog(): void {
    from(this.closeDialog().then(() => this.cancelled.emit()))
  }

  /**
  * Animates the dialog component out and returns a promise when the animation is finished.
  * @memberof DialogComponent
  * */
  private closeDialog() {
    return this.animateDialog('out').finished
  }

  /**
   * Returns an object with observables for dialog events.
   * @returns {Object} - An object with observables for dialog events.
   * @memberof DialogComponent
   **/
  get $() {
    return {
      onOpen: () => this.opened.asObservable(),
      onClose: () => this.result.asObservable(),
      onCancel: () => this.cancelled.asObservable(),
    }
  }

}

