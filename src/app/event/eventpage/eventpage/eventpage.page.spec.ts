import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventpagePage } from './eventpage.page';

describe('EventpagePage', () => {
  let component: EventpagePage;
  let fixture: ComponentFixture<EventpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventpagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
