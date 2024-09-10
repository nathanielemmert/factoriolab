import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { select } from 'd3';

import {
  sankeyCenter,
  sankeyJustify,
  sankeyLeft,
  sankeyRight,
} from '~/d3-sankey';
import { spread } from '~/helpers';
import { FlowDiagram, SankeyAlign } from '~/models';
import { ThemeService } from '~/services';
import {
  altClickSelector,
  assert,
  dragAndDropSelector,
  Mocks,
  TestModule,
  zoomSelector,
} from '~/tests';

import { FlowComponent, SVG_ID } from './flow.component';

describe('FlowComponent', () => {
  let component: FlowComponent;
  let fixture: ComponentFixture<FlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestModule, FlowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onResize', () => {
    it('should resize the cytoscape diagram', fakeAsync(() => {
      const fakeCy = { fit: (): void => {} };
      spyOn(fakeCy, 'fit');
      component.cy = fakeCy as any;
      component.onResize();
      tick(200);
      expect(fakeCy.fit).toHaveBeenCalled();
    }));
  });

  describe('ngAfterViewInit', () => {
    it('should rebuild the chart', fakeAsync(() => {
      spyOn(component, 'rebuildChart');
      TestBed.inject(ThemeService).themeValues$.next(Mocks.ThemeValues);
      tick();
      expect(component.rebuildChart).toHaveBeenCalled();
    }));
  });

  describe('rebuildChart', () => {
    it('should call to rebuild the sankey', () => {
      spyOn(component, 'rebuildSankey');
      component.rebuildChart(Mocks.Flow, Mocks.FlowSettings);
      expect(component.rebuildSankey).toHaveBeenCalledWith(
        Mocks.Flow,
        Mocks.FlowSettings,
      );
    });

    it('should call to rebuild the box-line', () => {
      spyOn(component, 'rebuildBoxLine');
      component.rebuildChart(
        Mocks.Flow,
        spread(Mocks.FlowSettings, { diagram: FlowDiagram.BoxLine }),
      );
      expect(component.rebuildBoxLine).toHaveBeenCalledWith(Mocks.Flow);
    });
  });

  describe('rebuildSankey', () => {
    beforeEach(() => {
      select(`#${SVG_ID} > *`).remove();
    });

    it('should build the sankey', () => {
      component.rebuildSankey(Mocks.Flow, Mocks.FlowSettings);
      const gElements = document.getElementsByTagName('g');
      expect(gElements.length).toEqual(14);
    });

    it('should handle drag and drop', () => {
      component.rebuildSankey(Mocks.Flow, Mocks.FlowSettings);
      dragAndDropSelector(fixture, 'rect', 100, 200);
      assert(component.svg != null);
      expect(component.svg.select('rect').attr('transform')).toBeTruthy();
      expect(
        component.svg.select('#image-r\\|0').attr('transform'),
      ).toBeTruthy();
    });

    it('should handle zoom', () => {
      component.rebuildSankey(Mocks.Flow, Mocks.FlowSettings);
      zoomSelector(fixture, '#lab-flow-svg > svg', 500);
      assert(component.svg != null);
      expect(component.svg.select('g').attr('transform')).toBeTruthy();
    });

    it('should set selectedId when a rect is clicked', () => {
      component.rebuildSankey(Mocks.Flow, Mocks.FlowSettings);
      altClickSelector(fixture, 'rect');
      expect(component.selectedId()).toEqual(Mocks.Flow.nodes[0].stepId);
    });

    it('should set selectedId emit when default is prevented', () => {
      component.rebuildSankey(Mocks.Flow, Mocks.FlowSettings);
      spyOn(component.selectedId, 'set');
      altClickSelector(fixture, 'rect', 0, true);
      expect(component.selectedId.set).not.toHaveBeenCalled();
    });
  });

  describe('rebuildBoxLine', () => {
    it('should build the chart from flow data', () => {
      component.rebuildBoxLine(Mocks.getFlow(true));
      expect(component.cy).toBeTruthy();
    });

    it('should set selectedId when a node is clicked', () => {
      component.rebuildBoxLine(Mocks.getFlow(true));
      spyOn(component.selectedId, 'set');
      component.cy?.nodes().emit('click');
      expect(component.selectedId.set).toHaveBeenCalled();
    });
  });

  describe('getAlign', () => {
    it('should return the proper sankey alignment function', () => {
      expect(component.getAlign(SankeyAlign.Justify)).toEqual(sankeyJustify);
      expect(component.getAlign(SankeyAlign.Left)).toEqual(sankeyLeft);
      expect(component.getAlign(SankeyAlign.Right)).toEqual(sankeyRight);
      expect(component.getAlign(SankeyAlign.Center)).toEqual(sankeyCenter);
    });
  });

  describe('nodeHeight', () => {
    it('should handle valid or nullish values', () => {
      const valid: any = { y1: 5, y0: 0 };
      const invalid: any = {};
      expect(component.nodeHeight(valid)).toEqual(5);
      expect(component.nodeHeight(invalid)).toEqual(0);
    });
  });
});
