import {Framework} from './framework/framework.js';

Framework.startModuleOrHome();

const navLinks = document.querySelectorAll('nav > a');
let activeElement;

function setActive() {
    const hash = location.hash ?? '#';
    activeElement?.classList?.remove('active');
    activeElement = [...navLinks].find(a => a.hash === hash);
    activeElement?.classList?.add('active');
}

setActive();

window.addEventListener("hashchange", setActive);