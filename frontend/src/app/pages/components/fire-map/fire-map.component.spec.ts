/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FireMapComponent } from './fire-map.component';

describe('FireMapComponent', () => {
  let component: FireMapComponent;
  let fixture: ComponentFixture<FireMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FireMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FireMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
