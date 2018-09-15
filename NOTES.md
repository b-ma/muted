# Editable Controllers

## @FIXME

- Toggle
- TextBox

## Names

Rapid                       gui     framework
              prototyping   ui      library
Minimalistic                visual  environment

GENE    Gui ENvironmEnt
> (in informal use) a unit of heredity that is transferred from a parent to offspring and is held to determine some characteristic of the offspring.

MEO   Minimalistic EnvirOnment
RoGUE   Rapid GUi Environment
MIME    MIniMalistic Environment
> the theatrical technique of suggesting action, character, or emotion without words, using only gesture, expression, and movement.

MUtEd   Minimalistic Ui Environment !!!
> ok npm
> deaden, muffle, or soften the sound of.

## Todos

- refine separation of concerns between mixins and states
- bootstrap inspector with few components:
  * NumberBox
  * Toggle
  * Comment
  * TextBox


## Thoughts

- Components must inherit Component
- remove mixins and create states, component has a behavior state machine
  (think about a mix of states and behaviors, ex. resizable implies a mixin for the GUI and a state (or a set of states) when the gui takes control:
  + editableInEditationMode (comments, text, etc.)
  + editableInPlayingMode (number box)
  + resizable
  + movable (remove from components)
  + etc...

- all behaviors should be state machines
- rename components to Area

## Other Components

- Slider
- Button
- Bang
- EmptyBox => target for lfo displays, element that can be used from code for whatever reason


## File System

patcher

/workspace
  Scene
  Inspector

/mixins
  
/components
  BaseComponents
  NumberBox
  TextBox
  Comment
  Toggle
