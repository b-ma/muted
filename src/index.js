import Scene from './lib/areas/Scene';

const scene = new Scene('my-id');
scene.render();
scene.editable = true;

// create component
const elms = [];

for (let i = 0; i < 10; i++) {
  const a = scene.createComponent('number-box', 64 * i + 100, 50);
  elms.push(a);
}

const target = `maintenant`;
let index = 0;

(function advance() {
  elms.forEach(elm => elm.value = Math.random());

  setTimeout(advance, 20);
})();
// a.outputChannel = 'my-component'; // should come from inspector config

// scene.createInspector(a);

// listeners
// scene.addListener('my-number', value => console.log('number', value));

window.scene = scene;

// delete
// setTimeout(() => scene.deleteComponent(a), 6000);

const width = window.innerWidth;
const height = window.innerHeight;

// for (let i = 0; i < 10000; i++) {
//   const x = Math.floor(Math.random() * width - 10);
//   const y = Math.floor(Math.random() * height - 10);
//   scene.createComponent('toggle', x, y);
// }


scene.addListener('test', value => console.log('toggle', value));

const synth = window.speechSynthesis;
const utterThis = new SpeechSynthesisUtterance(target);
synth.speak(utterThis);
