import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, QueryList, ViewChild, ViewChildren, ViewRef } from '@angular/core';
import { IDialog } from '../../interfaces';
import { TDialog } from '../../types/common.types';
import { map, Observable, of, Subject } from 'rxjs';
import * as CSS from 'csstype';

/**
 * Represents a dialog component that can be used to display messages and gather user input.
 * This component implements the IDialog and AfterViewInit interfaces.
 *  @implements IDialog, AfterViewInit
 *  @constructor DialogComponent
 */

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  host: {'class': 'app-dialog'},
})

export class DialogComponent implements IDialog, AfterViewInit {
  title: string = '';
  message: Observable<string | null>
  canClose: boolean = false;
  buttonOptions: string[];
  animationDelay = 300;
  animationDuration: number = 300;
  stylingOptions: CSS.Properties
  buttonStylingOptions: CSS.Properties = {};


  defualtStylingOptions = {
    color: 'black',
    backgroundColor: 'white',
    border: '1px solid black',
  }
  private _hostView: ViewRef;

  private result = new EventEmitter<string>();
  private opened = new EventEmitter<void>();
  private cancelled = new EventEmitter<void>();

  protected timerMessage: Observable<string>;
  
  @ViewChildren('dialogButton') dialogButtons: QueryList<ElementRef>;
  @ViewChild('dialogCt') dialogCt: ElementRef<HTMLDivElement>;

  constructor(
  ) {}

  ngAfterViewInit(): void {
    this.animateDialog('in');
  }

  /**
   * Initializes the dialog component with the specified configuration.
   * @param {TDialog} config - The configuration for the dialog component.
   * @returns {void}
   * @memberof DialogComponent
   **/
  private init(config: TDialog): void {
    try{
      this.title = config.title ?? '';
      this.message = config.message instanceof Observable ? config.message : of(config.message ?? '');
      this.canClose = config.canClose ?? false;
      this.buttonOptions = config.buttonOptions ?? [];
      this.stylingOptions =  config.stylingOptions ?? this.defualtStylingOptions;
      this.buttonStylingOptions = config.buttonStylingOptions!
    }
    catch(err){
      console.log(err);
    }
  }

  /**
   * Emits a result when a button is clicked and closes dialog.
   * @param {Event | string} event - The event or string to emit.
   * @returns {void}
   * @memberof DialogComponent
   **/
  protected emitResult(event: Event | string): void {
    let result: string = '';

    if (event instanceof Event) {
      const target = event.target as HTMLButtonElement;
      if (target.classList.contains('dialog-close')) {
        this.cancelDialog();
        return;
      }
      result = target.innerText;
    } else {
      result = event;
    }

    if (['cancel', 'close'].includes(result.toLowerCase())) {
      this.cancelDialog();
      return;
    }

    this.result.emit(result);
    this.closeDialog();
  }

  /**
   * Closes the dialog component and emits a cancelled event.
   * @memberof DialogComponent
   * */
  protected cancelDialog(): void {
    this.cancelled.emit();
    this.closeDialog();
  }

  private closeDialog(): void {
    this.animateDialog('out').finished.then(() => {
      this._hostView.destroy();
    });
  }

  /**
   * Opens a dialog component with the specified configuration.
   * @param {TDialog} config - The configuration for the dialog component.
   * @param {ViewRef} hostView - The view reference for the dialog component.
   * @param {number} closeAfter - The time in milliseconds to close the dialog after.
   * @param {boolean} showTimer - Whether to show a timer message.
   * @memberof DialogComponent
   **/
  openDialog(config: TDialog, hostView: ViewRef, closeAfter?: number, showTimer?: boolean) {
    try{
      this.init(config);
      this._hostView = hostView;
      this.opened.emit();

      if (closeAfter) {
        if (showTimer) {
          this.timerMessage = this.countdown(closeAfter).pipe(
            map(count => `Dialog closing in ${count} seconds.`)
          );
        }
        setTimeout(() => {
          this.closeDialog();
        }, closeAfter);
      }

      return this;
    }
    catch(err){
      console.log(err);
      return {
        onOpen: () => this.onOpen(),
        onClose: () => this.onClose(),
        onCancel: () => this.onCancel()
      }
    }
  }

  /**
    * Returns an observable that emits when the dialog is opened.
    * @returns {Observable<void>} - An observable that emits when the dialog is opened.
    * @memberof DialogComponent
    **/
  onOpen(): Observable<void> {
    return this.opened.asObservable();
  }

    /**
    * Returns an observable that emits when the dialog is opened.
    * @returns {Observable<string>} - An observable that emits when the dialog is closed.
    * @memberof DialogComponent
    **/
  onClose(): Observable<string> {
    return this.result.asObservable();
  }

  /**
    * Returns an observable that emits when the dialog is cancelled.
    * @returns {Observable<void>} - An observable that emits when the dialog is cancelled.
    * @memberof DialogComponent
    **/
  onCancel(): Observable<void> {
    return this.cancelled.asObservable();
  }

  /**
   * Animates the dialog component.
   * @param {string} direction - The direction to animate the dialog component.
   * @returns {Animation} - The animation object.
   * @memberof DialogComponent
  **/
  private animateDialog(direction: 'in' | 'out'): Animation {
    const animationOptions: KeyframeAnimationOptions = {
      duration: this.animationDuration,
      delay: this.animationDelay,
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
      }
    }, 1000);

    return countdownSubject.asObservable();
  }
}
