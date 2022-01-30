# midular

This is a project to build virtual MIDI devices using an approach inspired by modular synthesis. Devices can be added to a grid and can listen to events emitted by other devices. Imagine a clock that advances a sequencer that sends events that can trigger filters and musical notes, but instead of control voltages and thousands of dollars of Eurorack gear, it's just MIDI signals sent from an *entirely* virtualized instrument. Or imagine Max for Live, except agnostic of DAW and able to be run over a local network.

This project follows a bring-your-own-synthesizer ethos. It will never handle sound generation; _just_ enable otherwise-impossible generation of the events that other programs can use following a MIDI protocol. It _may_ add support for integration with other MIDI devices, such as recording playback or allowing input from physical devices.

This is very much in its nascency. Right now, it's built as a React webapp that communicates with a Socket.io server. In the future, once this project becomes useful enough that the reality of latency-over-wifi becomes a bottleneck, different technologies might be considered.

## Packages

This project uses Lerna to allow independent development of each piece. The current packages are:

- `client`: React app for building devices.
- `common`: Shared constants, such as event names.
- `server`: Communication between socket layer and native MIDI events.