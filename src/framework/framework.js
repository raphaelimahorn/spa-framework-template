import {loadHtmlAsync} from '../io/io.js';

export class Framework {

    static async replaceContentAsync(module) {
        document.getElementsByTagName('main')[0].innerHTML = await loadHtmlAsync(`./${module.name}/${module.name}.html`, console.warn);
        module?.init();
    }

    static async goHomeAsync() {
        document.getElementsByTagName('main')[0].innerHTML = await loadHtmlAsync(`./home.html`);
    }

    static async loadModuleAsync(moduleName) {
        // TODO add support for static html modules
        let m = await import(`../${moduleName}/${moduleName}.js`);
        if (!m.init) return;

        const module = new Module(moduleName, m.init);
        registerModule(module);

        return module;
    }

    static async startModuleOrHome() {
        const currentModule = location.hash?.substring(1);
        if (!currentModule) return await Framework.goHomeAsync();

        try {
            const module = getModuleByName(currentModule) ?? await Framework.loadModuleAsync(currentModule);
            await Framework.replaceContentAsync(module);
        } catch (e) {
            console.warn(e);
            await Framework.goHomeAsync();
        }
    }
}

let modules = [];

function registerModule(module) {
    modules = [...modules, module];
}

function getModuleByName(name) {
    return modules.find(module => module.name === name);
}

class Module {
    constructor(name, init) {
        this.name = name;
        this.init = init;
    }
}

window.addEventListener("hashchange", Framework.startModuleOrHome);