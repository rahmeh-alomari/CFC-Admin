import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferB2CComponent } from './transferB2C.component';

describe('TransferB2CComponent', () => {
  let component: TransferB2CComponent;
  let fixture: ComponentFixture<TransferB2CComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferB2CComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferB2CComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
