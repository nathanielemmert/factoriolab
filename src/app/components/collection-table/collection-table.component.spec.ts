import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mocks, setInputs, TestModule } from '~/tests';

import { CollectionTableComponent } from './collection-table.component';

describe('CollectionTableComponent', () => {
  let component: CollectionTableComponent;
  let fixture: ComponentFixture<CollectionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestModule, CollectionTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionTableComponent);
    component = fixture.componentInstance;
    setInputs(fixture, {
      ids: Mocks.AdjustedDataset.categoryIds,
      type: 'category',
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('route', () => {
    it('should get the correct parent route for the collection', () => {
      expect(component.route()).toContain('categories');
      setInputs(fixture, { type: 'item' });
      expect(component.route()).toContain('items');
      setInputs(fixture, { type: 'recipe' });
      expect(component.route()).toContain('recipes');
      setInputs(fixture, { useRelativePath: true });
      expect(component.route()).toEqual('');
    });
  });

  describe('balue', () => {
    it('should get an array of category collection items', () => {
      expect(component.value().length).toEqual(
        Mocks.AdjustedDataset.categoryIds.length,
      );
    });

    it('should get an array of item collection items', () => {
      setInputs(fixture, {
        ids: Mocks.AdjustedDataset.machineIds,
        type: 'item',
      });
      expect(component.value().length).toEqual(
        Mocks.AdjustedDataset.machineIds.length,
      );
    });

    it('should get an array of recipe collection items', () => {
      setInputs(fixture, {
        ids: Mocks.AdjustedDataset.technologyIds,
        type: 'recipe',
      });
      expect(component.value().length).toEqual(
        Mocks.AdjustedDataset.technologyIds.length,
      );
    });
  });
});
