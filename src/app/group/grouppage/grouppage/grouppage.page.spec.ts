import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrouppagePage } from './grouppage.page';

describe('GrouppagePage', () => {
  let component: GrouppagePage;
  let fixture: ComponentFixture<GrouppagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrouppagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrouppagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
