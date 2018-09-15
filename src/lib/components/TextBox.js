import BaseHtmlComponent from './BaseHtmlComponent';
import Movable from '../mixins/Movable';

const viewModelDefinitions = {};

const modelDefinitions = {
  value: {
    type: 'string',
    default: '',
  },
};

const inspectorConfig = {
  'default': 'text-box',
};


// remove mixins for state
class TextBox extends Movable(BaseHtmlComponent) {
  constructor(parent, viewModelOptions = {}) {
    viewModelOptions = Object.assign({ width: 180 }, viewModelOptions);
    super('text-box', parent, viewModelDefinitions, modelDefinitions, inspectorConfig, viewModelOptions);

    this._startInteraction = this._startInteraction.bind(this);
    this._endInteraction = this._endInteraction.bind(this);
  }

  set editable(value) {
    if (this.editable !== value) {
      super.editable = value;

      // text box is meant to interact with when not in editable mode
      if (this.editable === false) {
        this.$text.setAttribute('contenteditable', true);
        this.$eventTarget.addEventListener('mousedown', this._startInteraction);
      } else {
        this.$text.removeAttribute('contenteditable');
        this.$eventTarget.removeEventListener('mousedown', this._startInteraction);
      }
    }
  }

  get editable() {
    return super.editable;
  }

  delete() {
    const $target = this.$eventTarget;

    super.delete();
    $target.removeEventListener('mousedown', this._startInteraction);
  }

  render() {
    this.createContainer();

    this.$text = document.createElement('p');
    this.$el.appendChild(this.$text);

    return this.$el;
  }

  updateFromViewModel() {
    const width = this.viewModel.get('width');
    const height = this.viewModel.get('height');
    const x = this.viewModel.get('left');
    const y = this.viewModel.get('top');

    this.$el.style.transform = `translate(${x}px, ${y}px)`;
    this.$el.style.width = `${width}px`;
    this.$text.style.minHeight = `${height}px`;
    this.$text.style.lineHeight = `${height}px`;
  }

  updateFromModel() {
    this.$text.innerText = this.model.get('value');
  }

  _updateModel() {
    const value = this.$text.textContent;
    this.model.set('value', value);
  }

  _startInteraction(e) {
    e.stopPropagation();
    window.addEventListener('mousedown', this._endInteraction);
  }

  _endInteraction(e) {
    // clicked outside component
    if (this.isElementInComponent(e.target) === false) {
      this._updateModel();
      window.removeEventListener('mousedown', this._endInteraction);
    }
  }
}

export default TextBox;
