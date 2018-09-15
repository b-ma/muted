import Comment from './Comment';
import NumberBox from './NumberBox';
import TextBox from './TextBox';
import Toggle from './Toggle';

const factory = (parent, type, x, y) => {
  let component = null;

  switch (type) {
    case 'comment':
      component = new Comment(parent, { left: x, top: y });
      break;
    case 'number-box':
      component = new NumberBox(parent, { left: x, top: y });
      break;
    case 'text-box':
      component = new TextBox(parent, { left: x, top: y });
      break;
    case 'toggle':
      component = new Toggle(parent, { left: x, top: y });
      break;
    default:
      throw new Error(`Undefined component type: ${type}`);
      break;
  }

  return component;
};

export default factory;
