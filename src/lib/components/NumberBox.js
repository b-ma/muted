import BaseHtmlComponent from './BaseHtmlComponent';
import Movable from '../mixins/Movable';

const ns = 'http://www.w3.org/2000/svg';

const viewModelDefinitions = {};

const modelDefinitions = {
  value: {
    type: 'float',
    min: -Infinity,
    max: +Infinity,
    default: 0,
  },
};

const inspectorConfig = {
  'default': 'number-box',
  'min': 'number-box',
  'max': 'number-box',
};

class NumberBox extends Movable(BaseHtmlComponent) {
  constructor(parent, viewModelOptions = {}) {
    viewModelOptions = Object.assign({ width: 60 }, viewModelOptions);
    super('number-box', parent, viewModelDefinitions, modelDefinitions, inspectorConfig, viewModelOptions);

    this._onChange = this._onChange.bind(this);
  }

  set editable(value) {
    if (this.editable !== value) {
      super.editable = value;

      if (this.editable) {
        this.$number.setAttribute('readonly', true);
        this.$number.removeEventListener('change', this._onChange);
      } else {
        this.$number.removeAttribute('readonly');
        this.$number.addEventListener('change', this._onChange);
      }
    }
  }

  get editable() {
    return super.editable;
  }

  delete() {
    this.$number.removeEventListener('change', this._onChange);
    super.delete();
  }

  render() {
    this.createContainer();

    this.$number = document.createElement('input');
    this.$number.setAttribute('type', 'number');

    this.$el.appendChild(this.$number);

    return this.$el;
  }

  updateFromViewModel() {
    const width = this.viewModel.get('width');
    const height = this.viewModel.get('height');
    const x = this.viewModel.get('left');
    const y = this.viewModel.get('top');

    this.$el.style.transform = `translate(${x}px, ${y}px)`;
    this.$el.style.width = `${width}px`;
    this.$el.style.height = `${height}px`;
  }

  updateFromModel() {
    const modelDefinition = this.model.getDefinitions('value');
    // this should be handled in another way
    this.$number.setAttribute('min', modelDefinition.min);
    this.$number.setAttribute('max', modelDefinition.max);
    this.$number.value = this.value;
  }

  _onChange(e) {
    this.value = parseFloat(this.$number.value);
  }
}

export default NumberBox;
