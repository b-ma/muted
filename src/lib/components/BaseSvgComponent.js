import BaseAbstractComponent from './BaseAbstractComponent';

const ns = 'http://www.w3.org/2000/svg';

class SvgComponent extends BaseAbstractComponent {
  constructor(...args) {
    super(...args);

    this.svgNamespace = ns;
  }

  createContainer() {
    this.$el = document.createElement('div');
    this.$el.id = this.id;
    this.$el.classList.add('component', this.type);

    this.$svg = document.createElementNS(this.svgNamespace, 'svg');
    this.$svg.setAttributeNS(null, 'shape-rendering', 'optimizeSpeed');
    this.$svg.setAttribute('xmlns:xhtml', 'http://www.w3.org/1999/xhtml');

    this.$eventTarget = this.$svg;
    this.$el.appendChild(this.$svg);

    return this.$el;
  }
}

export default SvgComponent;
