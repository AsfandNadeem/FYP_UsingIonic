import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventscommentsPage } from './eventscomments.page';

describe('EventscommentsPage', () => {
  let component: EventscommentsPage;
  let fixture: ComponentFixture<EventscommentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventscommentsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventscommentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
