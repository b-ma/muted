import parameters from '@ircam/parameters';

let id = 0;

const defaultViewModelDefinitions = {
  width: {
    type: 'integer',
    min: 10,
    max: Infinity,
    step: 1,
    default: 30,
    metas: {},
  },
  height: {
    type: 'integer',
    min: 10,
    max: Infinity,
    step: 1,
    default: 30,
    metas: {},
  },
  top: {
    type: 'integer',
    min: 0,
    max: Infinity,
    default: 4,
    metas: {},
  },
  left: {
    type: 'integer',
    min: 0,
    max: Infinity,
    default: 4,
    metas: {},
  },
};

function copyDefinitions(defs) {
  const copy = {};

  for (let entry in defs)
    copy[entry] = Object.assign({}, defs[entry]);

  return copy;
}

class BaseAbstractComponent {
  constructor(type, parent, viewModelDefinitions, modelDefinitions, inspectorConfig, viewModelOptions) {
    this.id = `${type}-${id++}`;

    this.type = type;
    this.parent = parent;
    this.inspectorConfig = inspectorConfig;

    // @todo - clean that
    viewModelDefinitions = Object.assign({}, defaultViewModelDefinitions, viewModelDefinitions);
    this.viewModel = parameters(viewModelDefinitions, viewModelOptions);

    // copy that as we don't want to share the `value `definitions
    // between instances of the same component.
    this.model = parameters(copyDefinitions(modelDefinitions), {});

    // these has to be defined explicitly when the component is instanciated
    this._editable = null;
    this._edited = null;

    this._deleted = false;

    this.inputChannel = null;
    this.outputChannel = null;

    this._onComponentMouseDown = this._onComponentMouseDown.bind(this);
    this._onComponentMouseDownOut = this._onComponentMouseDownOut.bind(this);
  }

  set value(value) {
    this.model.set('value', value);
    this.updateFromModel();
  }

  get value() {
    return this.model.get('value');
  }

  set editable(value) {
    if (value !== this._editable) {
      this._editable = value;

      if (this._editable) {
        this.$el.classList.add('editable');
        this.$eventTarget.addEventListener('mousedown', this._onComponentMouseDown);
      } else {
        if (this.edited)
          this.edited = false;

        this.$el.classList.remove('editable');
        this.$eventTarget.removeEventListener('mousedown', this._onComponentMouseDown);
      }
    }
  }

  get editable() {
    return this._editable;
  }

  set edited(value) {
    // cna't be edited if not editable
    if (!this.editable)
      value = false;

    this._edited = value;

    if (this._edited)
      this.$el.classList.add('edited');
    else
      this.$el.classList.remove('edited');
  }

  get edited() {
    return this._edited;
  }

  set deleted(value) {
    this._deleted = value;
  }

  get deleted() {
    return this._deleted;
  }

  set top(value) {
    this.viewModel.set('top', value);
  }

  get top() {
    return this.viewModel.get('top');
  }

  set left(value) {
    this.viewModel.set('left', value);
  }

  get left() {
    return this.viewModel.get('left');
  }

  set width(value) {
    this.viewModel.set('width', value);
  }

  get width() {
    return this.viewModel.get('width');
  }

  set height(value) {
    this.viewModel.set('height', value);
  }

  get height() {
    return this.viewModel.get('height');
  }


  // destroy the component
  delete() {
    this.deleted = true;
    this.edited = false;
    this.editable = false;

    document.removeEventListener('mousedown', this._onComponentMouseDownOut);

    this.deleteElements();
  }

  deleteElements() {
    this.$el.remove();
    this.$el = null;
    this.$eventTarget = null;
  }

  isElementInComponent(element) {
    let match = false;
    let $el = element;

    do {
      if (this.$el === $el)
        match = true;
    } while ($el = $el.parentNode);

    return match;
  }

  /**
   * Creates the component's container element. The implementation of this
   * method should define `this.$el` as well as this.$eventTarget (in particular
   * for svg based element, the svg tag catch up all the events and should be the
   * listener of mouse events).
   *
   * @abstract
   * @return {Element} - the container element
   */
  createContainer() {}

  /**
   *
   *
   *
   */
  render() {}

  update() { // update
    this.updateFromViewModel();
    this.updateFromModel();
  }

  updateFromViewModel() {}
  // updateState ?
  updateFromModel() {}


  _onComponentMouseDown() {
    this.edited = true;
    document.addEventListener('mousedown', this._onComponentMouseDownOut);
  }

  // @todo - rename
  _onComponentMouseDownOut(e) {
    const inComponent = this.isElementInComponent(e.target);

    if (inComponent === false) {
      this.edited = false;

      document.removeEventListener('mousedown', this._onComponentMouseDownOut);
    }
  }
}

export default BaseAbstractComponent;
