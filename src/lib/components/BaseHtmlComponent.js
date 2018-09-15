import BaseAbstractComponent from './BaseAbstractComponent';

class BaseHtmlComponent extends BaseAbstractComponent {
  createContainer() {
    this.$el = document.createElement('div');
    this.$el.id = this.id;
    this.$el.classList.add('component', this.type);

    this.$eventTarget = this.$el;
  }
}

export default BaseHtmlComponent;
