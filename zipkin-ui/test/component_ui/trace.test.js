import $ from 'jquery';
import {showSpans, hideSpans, initSpans} from '../../js/component_ui/trace';
import {traceDetailSpan} from './traceTestHelpers';
import traceToMustache from '../../js/component_ui/traceToMustache';
import {traceTemplate} from '../../js/templates';
import {SPAN_V1} from '../../js/spanConverter';
import testTrace from '../../testdata/netflix';

describe('showSpans', () => {
  it('expands and highlights span to show', () => {
    const span = traceDetailSpan('0000000000000001');
    const spans = {'0000000000000001': span};
    const parents = {'0000000000000001': []};
    const children = {'0000000000000001': []};
    const selected = {0: span};

    showSpans(spans, parents, children, selected);

    span.expanderText.should.contain('-');
    span.expanded.should.equal(true);
    [...span.classes].should.contain('highlight');
  });

  it('sets shown, open parents and children based on selected spans', () => {
    const span1 = traceDetailSpan('0000000000000001');
    const span2 = traceDetailSpan('0000000000000002');
    const span3 = traceDetailSpan('0000000000000003');
    const span4 = traceDetailSpan('0000000000000004');
    const spans = {
      '0000000000000001': span1,
      '0000000000000002': span2,
      '0000000000000003': span3,
      '0000000000000004': span4
    };
    const parents = {
      '0000000000000001': [],
      '0000000000000002': ['0000000000000001'],
      '0000000000000003': ['0000000000000001'],
      '0000000000000004': ['0000000000000003']
    };
    const children = {
      '0000000000000001': ['0000000000000002', '0000000000000003'],
      '0000000000000002': [],
      '0000000000000003': ['0000000000000004'],
      '0000000000000004': []
    };
    const selected = {0: span3};

    showSpans(spans, parents, children, selected);

    span1.shown.should.equal(true); // because a child was selected
    span1.openParents.should.equal(0);
    span1.openChildren.should.equal(1); // because only span3 was selected

    span2.shown.should.equal(false);

    span3.shown.should.equal(true);
    span3.openParents.should.equal(0);
    span3.openChildren.should.equal(0);

    span4.shown.should.equal(true);
    span4.openParents.should.equal(1); // because its parent was selected
    span4.openChildren.should.equal(0);
  });

  it('works when root-most span parent is missing', () => {
    const span = traceDetailSpan('0000000000000001');
    const spans = {'0000000000000001': span};
    const parents = {'0000000000000001': ['0000000000000000']};
    const children = {'0000000000000001': []};
    const selected = {0: span};

    showSpans(spans, parents, children, selected);

    span.shown.should.equal(true);
    span.openParents.should.equal(0);
    span.openChildren.should.equal(0);
  });
});

describe('hideSpans', () => {
  it('collapses and removes highlight', () => {
    const span = traceDetailSpan('0000000000000001');
    const spans = {'0000000000000001': span};
    const parents = {'0000000000000001': []};
    const children = {'0000000000000001': []};
    const selected = {0: span};

    showSpans(spans, parents, children, selected);
    hideSpans(spans, parents, children, selected);

    span.expanderText.should.contain('+');
    span.expanded.should.equal(false);
    [...span.classes].should.not.contain('highlight');
  });

  it('sets hidden, open parents and children based on selected spans', () => {
    const span1 = traceDetailSpan('0000000000000001');
    const span2 = traceDetailSpan('0000000000000002');
    const span3 = traceDetailSpan('0000000000000003');
    const span4 = traceDetailSpan('0000000000000004');
    const spans = {
      '0000000000000001': span1,
      '0000000000000002': span2,
      '0000000000000003': span3,
      '0000000000000004': span4
    };
    const parents = {
      '0000000000000001': [],
      '0000000000000002': ['0000000000000001'],
      '0000000000000003': ['0000000000000001'],
      '0000000000000004': ['0000000000000003']
    };
    const children = {
      '0000000000000001': ['0000000000000002', '0000000000000003'],
      '0000000000000002': [],
      '0000000000000003': ['0000000000000004'],
      '0000000000000004': []
    };
    const selected = {0: span3};

    showSpans(spans, parents, children, selected);
    hideSpans(spans, parents, children, selected);

    span1.hidden.should.equal(true);
    span1.openParents.should.equal(0);
    span1.openChildren.should.equal(0);

    span2.hidden.should.equal(false);

    span3.hidden.should.equal(true);
    span3.openParents.should.equal(0);
    span3.openChildren.should.equal(0);

    span4.hidden.should.equal(true);
    span4.openParents.should.equal(0);
    span4.openChildren.should.equal(0);
  });

  it('doesnt hide parents when childrenOnly', () => {
    const span1 = traceDetailSpan('0000000000000001');
    const span2 = traceDetailSpan('0000000000000002');
    const span3 = traceDetailSpan('0000000000000003');
    const span4 = traceDetailSpan('0000000000000004');
    const spans = {
      '0000000000000001': span1,
      '0000000000000002': span2,
      '0000000000000003': span3,
      '0000000000000004': span4
    };
    const parents = {
      '0000000000000001': [],
      '0000000000000002': ['0000000000000001'],
      '0000000000000003': ['0000000000000001'],
      '0000000000000004': ['0000000000000003']
    };
    const children = {
      '0000000000000001': ['0000000000000002', '0000000000000003'],
      '0000000000000002': [],
      '0000000000000003': ['0000000000000004'],
      '0000000000000004': []
    };
    const selected = {0: span3};

    showSpans(spans, parents, children, selected);
    hideSpans(spans, parents, children, selected, true);

    span1.hidden.should.equal(false);
    span2.hidden.should.equal(false);
    span3.hidden.should.equal(false);
    span4.hidden.should.equal(true);
  });

  it('works when root-most span parent is missing', () => {
    const span = traceDetailSpan('0000000000000001');
    const spans = {'0000000000000001': span};
    const parents = {'0000000000000001': ['0000000000000000']};
    const children = {'0000000000000001': []};
    const selected = {0: span};

    showSpans(spans, parents, children, selected);
    hideSpans(spans, parents, children, selected);

    span.hidden.should.equal(true);
    span.openParents.should.equal(0);
    span.openChildren.should.equal(0);
  });
});

function renderTrace(trace) {
  const view = traceToMustache(trace);
  const container = $('<div/>');
  const x = {contextRoot: '/zipkin/', ...view};
  container.html(traceTemplate(x));
  return container.find('#trace-container');
}

describe('initSpans', () => {
  it('should return initial data from rendered trace', () => {
    const v1trace = [];
    testTrace.forEach((span) => {
      v1trace.push(SPAN_V1.convert(span));
    });
    const $trace = renderTrace(v1trace);
    const data = initSpans($trace);
    const span = data.spans['90394f6bcffb5d13'];
    span.id.should.equal('90394f6bcffb5d13');
    span.expanded.should.equal(false);
    span.isRoot.should.equal(true);
    data.spansByService.apip.length.should.equal(4);
    data.spansByService.apip[0].should.equal('90394f6bcffb5d13');
    // Child span should not be visible on the first load
    const childSpan = data.spans['67fae42571535f60'];
    childSpan.isRoot.should.equal(false);
    childSpan.is(':visible').should.equal(false);
  });
});
