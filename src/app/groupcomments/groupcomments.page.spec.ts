import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupcommentsPage } from './groupcomments.page';

describe('GroupcommentsPage', () => {
  let component: GroupcommentsPage;
  let fixture: ComponentFixture<GroupcommentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupcommentsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupcommentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
