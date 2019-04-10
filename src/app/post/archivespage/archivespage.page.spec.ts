import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivespagePage } from './archivespage.page';

describe('ArchivespagePage', () => {
  let component: ArchivespagePage;
  let fixture: ComponentFixture<ArchivespagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivespagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivespagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
