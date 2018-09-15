import componentFactory from '../components/factory';
import Inspector from './Inspector';
import Keyboard from 'keyboardjs';

/** extends Component */
class Scene {
  constructor(id) {
    this.id = id;

    this.components = new Set();
    this.inspectors = new Map();

    this._editable = false;
    this._onMouseMove = this._onMouseMove.bind(this);
    // should initialize at center of the screen
    this._mousePosition = { x: 0, y: 0 };

    this._listeners = new Map();

    this._createComponentLastX = null;
    this._createComponentLastY = null;
    this._createComponentIterator = 0;
  }

  set editable(value) {
    this._editable = value;

    if (this._editable) {
      this.$el.classList.add('editable');
      this.$el.addEventListener('mousemove', this._onMouseMove);

      for (let component of this.components) {
        component.editable = true;

        if (this.inspectors.has(component)) {
          const inspector = this.inspectors.get(component);
          inspector.show();
        }
      }
    } else {
      this.$el.classList.remove('editable');
      this.$el.removeEventListener('mousemove', this._onMouseMove);

      for (let component of this.components) {
        component.editable = false;

        if (this.inspectors.has(component)) {
          const inspector = this.inspectors.get(component);
          inspector.hide();
        }
      }
    }
  }

  get editable() {
    return this._editable;
  }

  render(width = window.innerWidth, height = window.innerHeight) {
    const $el = document.createElement('div');
    $el.classList.add('component-container');

    $el.style.width = `${width}px`;
    $el.style.height = `${height}px`;
    $el.style.fontSize = 0;

    this.$el = $el;
    this.bindEvents();

    document.body.appendChild(this.$el);
  }


  createComponent(type, x, y) {
    x = x || this._mousePosition.x;
    y = y || this._mousePosition.y;

    // handle creation of several components at the same place
    if (this._createComponentLastX === x && this._createComponentLastY === y) {
      this._createComponentIterator += 1;
      x = x + this._createComponentIterator * 10;
      y = y + this._createComponentIterator * 10;
    } else {
      this._createComponentIterator = 0;
      this._createComponentLastX = x;
      this._createComponentLastY = y;
    }

    const component = componentFactory(this, type, x, y);
    const $el = component.render();

    component.update();
    component.editable = this.editable;

    if (this.editable) {
      // focus on new component
      for (let existingComponent of this.components) {
        if (existingComponent.edited)
          existingComponent.edited = false;
      }

      component.editable = true;
      component.edited = true;
    }

    this.components.add(component);
    this.$el.appendChild($el);

    component.model.addParamListener('value', this.broadcast(component));

    return component;
  }

  deleteComponent(component) {
    if (this.inspectors.has(component)) {
      const inspector = this.inspectors.get(component);
      inspector.delete();

      this.inspectors.delete(component);
    }

    component.delete();
    this.components.delete(component);
  }

  /**
   * @todo - remove hard-coded width and height
   */
  createInspector(component) {
    if (component.inspectorConfig !== null && !this.inspectors.has(component)) {
      const inspector = new Inspector(component);
      const $el = inspector.render();
      component.$el.appendChild($el);

      this.inspectors.set(component, inspector);
    }
  }

  deleteInspector(component) {
    const inspector = this.inspectors.get(component);
    inspector.delete();

    this.inspectors.delete(component);
  }

  // @todo - refactor
  // move to some upper layer
  bindEvents() {
    Keyboard.bind('ctrl + e', () => {
      this.editable = !this.editable;

      if (this.editable)
        Keyboard.setContext('editable');
      else
        Keyboard.setContext('none');

      console.log('[editable mode]', this.editable);
    });

    Keyboard.setContext('editable');
    Keyboard.bind('ctrl + c', () => this.createComponent('comment'));
    Keyboard.bind('ctrl + n', () => this.createComponent('number-box'));
    Keyboard.bind('ctrl + r', () => this.createComponent('text-box'));
    Keyboard.bind('ctrl + t', () => this.createComponent('toggle'));

    Keyboard.bind('ctrl + i', () => {
      for (let component of this.components) {
        if (component.edited) {
          if (this.inspectors.has(component))
            this.deleteInspector(component);
          else
            this.createInspector(component);
        }
      }
    });

    Keyboard.bind('ctrl + w', () => {
      for (let component of this.components) {
        if (component.edited)
          this.deleteComponent(component);
      }
    });
  }

  _onMouseMove(e) {
    this._mousePosition.x = e.layerX;
    this._mousePosition.y = e.layerY;
  }

  /**
   * @todo
   *
   * this is the most naive possible implementation, find a solution
   * for at least make it work accros multiple tabs/windows by default
   */
  addListener(outputChannel, callback) {
    if (!this._listeners.has(outputChannel))
      this._listeners.set(outputChannel, new Set());

    const listeners = this._listeners.get(outputChannel);
    listeners.add(callback);
  }

  broadcast(component) {
    return value => {
      const outputChannel = component.outputChannel;
      const listeners = this._listeners.get(outputChannel);

      if (listeners)
        listeners.forEach(listener => listener(value));
    }
  }
};

export default Scene;
