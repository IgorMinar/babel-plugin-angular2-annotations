import 'zone.js/lib/browser/zone-microtask';
import 'reflect-metadata';
import 'babel-polyfill';

import {BrowserDomAdapter} from 'angular2/platform/browser'
BrowserDomAdapter.makeCurrent();

import {
  describe,
  expect,
  it
} from 'angular2/testing_internal';

import {
  EventEmitter,
  Component,
  Attribute,
  Input,
  Output,
  ComponentMetadata,
  AttributeMetadata,
  InputMetadata,
  OutputMetadata,
  reflector
} from 'angular2/core';

describe('reflection', () => {
  it('Class decorator', () => {
    @Component({
      selector: 'hello-world'
    })
    class HelloWorld {
    }

    expect(reflector.annotations(HelloWorld)).toEqual([
      new ComponentMetadata({ selector: 'hello-world' })
    ]);
  });

  it('Class property decorator', () => {
    class HelloWorld {
      @Input() name;
      @Output('g') greetings = new EventEmitter();
    }

    expect(reflector.propMetadata(HelloWorld)).toEqual({
      name: [new InputMetadata()],
      greetings: [new OutputMetadata('g')]
    });
  });

  it('Constructor parameter decorator', () => {
    class HelloWorld {
      constructor(@Attribute('g') greeting, @Attribute() name) {
        this.greeting = greeting;
        this.name = name;
      }
    }

    expect(reflector.parameters(HelloWorld)).toEqual([
      [new AttributeMetadata('g')],
      [new AttributeMetadata()]
    ]);
  });

  it('Constructor parameter type annotation', () => {
    class Greeter {
    }

    class HelloWorld {
      constructor(greeter: Greeter, something, anotherGreeter: Greeter) {
      }
    }

    expect(reflector.parameters(HelloWorld)).toEqual([
      [Greeter],
      [undefined],
      [Greeter]
    ]);
  });

  it('All in one', () => {
    class Greeter {
    }

    @Component({
      selector: 'hello-world'
    })
    class HelloWorld {
      @Input() foo;
      @Output('g') greetings = new EventEmitter();

      constructor(greeter: Greeter, @Attribute('n') name, anotherGreeter: Greeter) {
      }
    }

    expect(reflector.propMetadata(HelloWorld)).toEqual({
      foo: [new InputMetadata()],
      greetings: [new OutputMetadata('g')]
    });
    expect(reflector.annotations(HelloWorld)).toEqual([
      new ComponentMetadata({ selector: 'hello-world' })
    ]);
    expect(reflector.parameters(HelloWorld)).toEqual([
      [Greeter],
      [undefined, new AttributeMetadata('n')],
      [Greeter]
    ]);
  });
});