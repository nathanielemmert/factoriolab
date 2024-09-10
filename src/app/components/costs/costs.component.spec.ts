import { ComponentFixture, TestBed } from '@angular/core/testing';

import { rational } from '~/models';
import { Settings } from '~/store';
import { Mocks, TestModule } from '~/tests';

import { CostsComponent } from './costs.component';

describe('CostsComponent', () => {
  let component: CostsComponent;
  let fixture: ComponentFixture<CostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestModule, CostsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('modified', () => {
    it('should determine whether the value matches the initial state', () => {
      component.reset();
      expect(component.modified).toBeFalse();
      component.editValue.surplus = rational.one;
      expect(component.modified).toBeTrue();
    });
  });

  describe('open', () => {
    it('should set up the editValue and show the dialog', () => {
      spyOn(component, 'show');
      component.editValue = null as any;
      component.open(Mocks.Costs);
      expect(component.editValue).toEqual(Mocks.Costs);
      expect(component.editValue).not.toBe(Mocks.Costs);
      expect(component.show).toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('should set the value back to the initial state', () => {
      component.editValue = null as any;
      component.reset();
      expect(component.editValue).toEqual(Settings.initialState.costs);
    });
  });

  describe('save', () => {
    it('should dispatch the action', () => {
      spyOn(component.store, 'dispatch');
      component.save();
      expect(component.store.dispatch).toHaveBeenCalledWith(
        Settings.setCosts({ costs: component.editValue }),
      );
    });
  });
});
