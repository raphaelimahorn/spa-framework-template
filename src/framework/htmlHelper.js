import {loadHtmlAsync} from '../io/io.js';

export class HtmlHelper {

    /**
     * @param name {string} the name of the template
     * @param path {string} the path where the html template can be found
     * @returns {Promise<Template>}
     */
    static async registerTemplateFromUrlAsync(name, path) {
        if (templates.has(name)) return templates.get(name);

        const template = await loadHtmlAsync(path);

        return this.registerTemplateFromString(name, template);
    }

    /**
     * @param name {string} the name of the template
     * @param template {string} the html template
     * @returns {Template}
     */
    static registerTemplateFromString(name, template) {
        return templates.get(name) ?? createAndRegisterTemplate(name, template);
    }

    /**
     * @param name {string} the name of the template
     * @param object {T}
     * @returns {string}
     */
    static fillInTemplate(name, object) {
        return templates.get(name)?.replace(object) ?? '';
    }
}

function createAndRegisterTemplate(name, template) {
    const newTemplate = new Template(name, template);
    templates.set(name, newTemplate);
    return newTemplate;
}

/**
 * @type {Map<string, Template>}
 */
let templates = new Map();

/** @template T */
class Template {

    /**
     * @param name {string} the name of the template
     * @param template {string} a html template
     */
    constructor(name, template) {
        this.template = template;
        /** @type {Map<string, function(?T):string | string>} */
        this.replacements = new Map();
    }

    /**
     * @param what {string}
     * @param withWhat {function(?T):string | string}
     * @returns {Template}
     */
    registerReplacer(what, withWhat) {
        if (!this.replacements.has(what)) {
            this.replacements.set(what, withWhat);
        }
        return this;
    }

    /**
     * @param object {?T}
     * @returns {string}
     */
    replace(object) {
        let temp = this.template;
        this.replacements.forEach((replacer, from) => {
            const to = (typeof replacer === 'function') ? replacer(object) : replacer;
            temp = temp.replaceAll(from, to);
        });
        return temp;
    }
}
