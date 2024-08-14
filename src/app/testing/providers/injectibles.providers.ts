import { ChangeDetectorRef, ElementRef, EnvironmentInjector, EventEmitter, Injector, ViewContainerRef, ViewRef } from '@angular/core';
import { Subject } from 'rxjs';
import { Mock } from 'ts-mocks';


export class MockTokens<T> extends Mock<T> {
    provider: { provide: {}, useValue: T };
    
    static mockViewContainerRef(config?: { 
        instance?: any, 
        hostViewRef?: any,
        hostView? : any,
        location?: any
        setInput?: () => any,
        destroy?: () => any,
        injector?: any
        changeDetectorRef?: any
        componentType?: any
        onDestroy?: () => any}): MockTokens<ViewContainerRef> {
        
        const mock = new MockTokens<ViewContainerRef>({
            get: (index?: number) => { return 1 as any },
            indexOf: (view?: ViewRef) => -1,
            detach: (index?: number) => null,
            insert: (view?: ViewRef) => config!.hostViewRef || null,
            createComponent: () => {
                return {
                    instance: config!.instance || null,
                    hostView : config!.hostViewRef || null,
                    location: config!.location || null,
                    setInput: () => config!.setInput!() || null,
                    destroy: () => config!.destroy!() || null,
                    injector: config!.injector || MockTokens.mockInjector().Object,
                    changeDetectorRef: config!.changeDetectorRef || MockTokens.mockChangeDetectorRef().Object,
                    componentType: config!.componentType || null,
                    onDestroy: () => config!.onDestroy!() || null
                }

            }
        });
        mock.provider = { provide: ViewContainerRef, useValue: mock.Object }
        return mock;
    }

    static mockInjector(): MockTokens<Injector> {
        const mock = new MockTokens<Injector>({
            get: () => null
        });
        mock.provider = { provide: Injector, useValue: mock.Object }
        return mock;
    }
    static mockEnvironmentInjector(): MockTokens<EnvironmentInjector> {
        const mock = new MockTokens<EnvironmentInjector>({
            get: () => null,
        });
        mock.provider = { provide: EnvironmentInjector, useValue: mock.Object }
        return mock;
    }

    static mockChangeDetectorRef(): MockTokens<ChangeDetectorRef> {
        const mock = new MockTokens<ChangeDetectorRef>({
            detectChanges: () => null
        });
        mock.provider = { provide: ChangeDetectorRef, useValue: mock.Object }
        return mock;
    }
}
  