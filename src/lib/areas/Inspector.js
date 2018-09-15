import componentFactory from '../components/factory';
import Keyboard from 'keyboardjs';
import Movable from '../mixins/Movable';

/**
 * This shouldn't not be hard-coded and we should be able
 * to modify these values from css
 */
const yOffset = 14;  // @todo - rename
const yStep = 40;    // @todo - rename
const xCol0 = 10; // @todo - rename
const xCol1 = 160; // @todo - rename

/**
 * define if it should extends Component.
 * be movable ?
 */
class Inspector {
  constructor(component) {
    this.id = 'inspector-' + component.id;
    this.component = component;

    this.components = new Set();

    this.left = null;
    this.top = null;
  }

  delete() {
    for (let component of this.components) {
      component.model.removeParamListener('value');
      component.delete();
    }

    this.$el.remove();
  }

  show() {
    this.$el.style.display = 'block';
  }

  hide() {
    this.$el.style.display = 'none';
  }

  /**
   * Inspector is appended inside the component, see Scene.
   */
  render() {
    const left = this.component.width;

    this.$el = document.createElement('div');
    this.$el.classList.add('component-container', 'inspector');
    const infos = this._renderInterfaceFromComponentDefinition();

    this.$el.style.display = 'block';
    this.$el.style.width = `${infos.width}px`;
    this.$el.style.height = `${infos.height}px`;
    this.$el.style.left = `${left + 3}px`;
    this.$el.style.top = `-1px`;
    this.$el.style.fontSize = 0;

    return this.$el;
  }

  // @note - maybe private
  createComponent(type, x, y) {
    const component = componentFactory(this, type, x, y);
    const $el = component.render();
    component.update();
    component.editable = false;

    this.components.add(component);
    this.$el.appendChild($el);

    return component;
  }

  _renderInterfaceFromComponentDefinition(x) {
    const component = this.component;
    const valueDefinition = component.model.getDefinitions('value');
    const inspectorConfig = component.inspectorConfig;

    let y = yOffset;

    // title
    const title0 = this.createComponent('comment', xCol0, y);
    title0.value = `> ${component.id}`;

    y += yStep;

    // inspector for the type parameters
    for (let attr in inspectorConfig) {
      const type = inspectorConfig[attr];

      // comment
      const label = this.createComponent('comment', xCol0, y);
      label.value = attr;
      // field
      const field = this.createComponent(type, xCol1, y);
      field.value = valueDefinition[attr];


      field.model.addParamListener('value', value => {
        valueDefinition[attr] = value;
        // force component update according to new constraints (e.g. min, max)
        component.value = component.value;
      });

      y += yStep;
    }

    // output
    const title1 = this.createComponent('comment', xCol0, y);
    title1.value = '> bindings';

    y += yStep;

    ['input', 'output'].forEach(binding => {
      const attr = `${binding}Channel`;

      const label = this.createComponent('comment', xCol0, y);
      label.value = binding;

      const field = this.createComponent('text-box', xCol1, y);
      field.value = component[attr] !== null ? component[attr] : '';
      field.model.addParamListener('value', value => component[attr] = value);

      y += yStep;
    });

    y += yOffset;

    return { height: y, width: 360 };
  }
};

export default Inspector;
