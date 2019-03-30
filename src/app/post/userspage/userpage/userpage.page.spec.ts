import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserpagePage } from './userpage.page';

describe('UserpagePage', () => {
  let component: UserpagePage;
  let fixture: ComponentFixture<UserpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserpagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
