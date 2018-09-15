import BaseSvgComponent from './BaseSvgComponent';
import Movable from '../mixins/Movable';

// edit behavior
// static behavior
const viewModelDefinitions = {
  padding: {
    type: 'integer',
    min: 0,
    max: Infinity,
    default: 4,
    metas: {},
  },
};

const modelDefinitions = {
  value: {
    type: 'boolean',
    default: false,

  }
};

const inspectorConfig = {
  'default': 'toggle',
};

class Toggle extends Movable(BaseSvgComponent) {
  constructor(parent, viewModelOptions = {}) {
    super('toggle', parent, viewModelDefinitions, modelDefinitions, inspectorConfig, viewModelOptions);

    this._updateModel = this._updateModel.bind(this);
  }

  set editable(value) {
    if (this.editable !== value) {
      super.editable = value;

      if (this.editable === false && this.deleted === false) {
        this.$eventTarget.addEventListener('mousedown', this._updateModel);
        if (this.id === 'toggle-0')
          console.log('here');
      }
      else
        this.$eventTarget.removeEventListener('mousedown', this._updateModel);
    }
  }

  get editable() {
    return super.editable;
  }

  render() {
    this.createContainer();

    const $line1 = document.createElementNS(this.svgNamespace, 'line');
    const $line2 = document.createElementNS(this.svgNamespace, 'line');

    $line1.classList.add('cross');
    $line2.classList.add('cross');

    this.$svg.appendChild($line1);
    this.$svg.appendChild($line2);

    this.$line1 = $line1;
    this.$line2 = $line2;

    return this.$el;
  }

  updateFromViewModel() {
    const width = this.viewModel.get('width');
    const height = this.viewModel.get('height');
    const x = this.viewModel.get('left');
    const y = this.viewModel.get('top');
    const padding = this.viewModel.get('padding');

    this.$el.style.transform = `translate(${x}px, ${y}px)`;
    this.$el.style.width = `${width}px`;
    this.$el.style.height = `${height}px`;

    this.$svg.setAttributeNS(null, 'width', width);
    this.$svg.setAttributeNS(null, 'height', height);

    this.$line1.setAttribute('x1', padding);
    this.$line1.setAttribute('y1', padding);
    this.$line1.setAttribute('x2', width - padding);
    this.$line1.setAttribute('y2', height - padding);

    this.$line2.setAttribute('x1', padding);
    this.$line2.setAttribute('y1', height - padding);
    this.$line2.setAttribute('x2', width - padding);
    this.$line2.setAttribute('y2', padding);
  }

  updateFromModel() {
    const active = this.value;

    if (active === true)
      this.$el.classList.add('active');
    else
      this.$el.classList.remove('active');
  }

  _updateModel(e) {
    this.value = !this.value;
  }
}

export default Toggle;
