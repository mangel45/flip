import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebadminComponent } from './webadmin.component';

describe('WebadminComponent', () => {
  let component: WebadminComponent;
  let fixture: ComponentFixture<WebadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
