
/**
 * Does this make sens as all components should be movable...
 */
const Movable = (superclass) => class extends superclass {
  constructor(...args) {
    super(...args);

    this._onMovableMouseDown = this._onMovableMouseDown.bind(this);
    this._onMovableMouseMove = this._onMovableMouseMove.bind(this);
    this._onMovableMouseUp = this._onMovableMouseUp.bind(this);
  }

  set editable(value) {
    super.editable = value;

    if (this._editable)
      this.$eventTarget.addEventListener('mousedown', this._onMovableMouseDown);
    else
      this.$eventTarget.removeEventListener('mousedown', this._onMovableMouseDown);
  }

  get editable() {
    return this._editable;
  }

  _onMovableMouseDown(e) {
    this._lastX = e.layerX;
    this._lastY = e.layerY;
    this._mousedown = true;

    this.parent.$el.appendChild(this.$el);

    document.addEventListener('mousemove', this._onMovableMouseMove);
    document.addEventListener('mouseup', this._onMovableMouseUp);
  }

  _onMovableMouseMove(e) {
    const x = e.layerX;
    const y = e.layerY;

    if (this._mousedown === true) {
      const dx = this._lastX - x;
      const dy = this._lastY - y;

      this.left -= dx;
      this.top -= dy;

      this.updateFromViewModel();
    }

    this._lastX = x;
    this._lastY = y;
  }

  _onMovableMouseUp() {
    this._mousedown = false;

    document.removeEventListener('mousemove', this._onMovableMouseMove);
    document.removeEventListener('mouseup', this._onMovableMouseUp);
  }
}

export default Movable;
