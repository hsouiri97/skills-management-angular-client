import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMatricesComponent } from './my-matrices.component';

describe('MyMatricesComponent', () => {
  let component: MyMatricesComponent;
  let fixture: ComponentFixture<MyMatricesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyMatricesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMatricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
