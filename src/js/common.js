import {sayHi, sayBye} from './modules/say.js';
// import '~/app/libs/mmenu/dist/mmenu.js'

document.addEventListener('DOMContentLoaded', () => {
	sayHi('Tom');
	sayBye('Tom');
});
