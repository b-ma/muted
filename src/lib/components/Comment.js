import BaseHtmlComponent from './BaseHtmlComponent';
import Movable from '../mixins/Movable';

const ns = 'http://www.w3.org/2000/svg';

const viewModelDefinitions = {};

const modelDefinitions = {
  value: {
    type: 'string',
    default: '',
  },
};

const inspectorConfig =  null;

// remove mixins for state
class Comment extends Movable(BaseHtmlComponent) {
  constructor(parent, viewModelOptions = {}) {
    viewModelOptions = Object.assign({ width: 180 }, viewModelOptions);
    super('comment', parent, viewModelDefinitions, modelDefinitions, inspectorConfig, viewModelOptions);
  }

  set editable(value) {
    super.editable = value;

    if (this.editable)
      this.$text.setAttribute('contenteditable', true);
    else
      this.$text.removeAttribute('contenteditable');
  }

  get editable() {
    return super.editable;
  }

  set edited(value) {
    super.edited = value;

    // update model when edition finish. we need to check `deleted` because
    // deleted set adited to false and we don't want to trigger listeners on a deletion
    if (this.edited === false && this.deleted === false)
      this._updateModel();
  }

  get edited() {
    return super.edited;
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

  _updateModel(e) {
    const value = this.$text.textContent;
    this.model.set('value', value);
  }
}

export default Comment;
