import { ElementRef, EnvironmentInjector, ViewContainerRef, ViewRef } from '@angular/core';
import { Mock } from 'ts-mocks';

export class MockTokens<T> extends Mock<T> {
    provider: { provide: {}, useValue: T };

    static mockViewContainerRef(): MockTokens<ViewContainerRef> {
        const mock = new MockTokens<ViewContainerRef>({
            get: (index: number) => { return 1 as any },
            indexOf: (view: ViewRef) => -1,
            insert: (view: ViewRef) => null as any,
            detach: () => null
        });
        mock.provider = { provide: ViewContainerRef, useValue: mock.Object }
        return mock;
    }

    static mockEnvironmentInjector(): MockTokens<EnvironmentInjector> {
        const mock = new MockTokens<EnvironmentInjector>({
            get: () => null,
        });
        mock.provider = { provide: EnvironmentInjector, useValue: mock.Object }
        return mock;
    }

}
  