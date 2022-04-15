import {loadJsonAsync} from '../io/io.js';
import {HtmlHelper} from "../framework/htmlHelper.js";

let eventTemplate;
let eventWrapper;

function renderYear(eventsInYear, year) {
    eventWrapper.insertAdjacentHTML('beforeend', `<h2 class="year">${year}</h2>`);
    eventsInYear
        .sort((a, b) => a.from - b.from)
        .forEach(renderEvent);
}

/** @param event {Event} */
function renderEvent(event) {
    eventWrapper.insertAdjacentHTML('beforeend', eventTemplate.replace(event));
}

async function initializeEventTemplateAsync() {
    eventTemplate = (await HtmlHelper.registerTemplateFromUrlAsync('event', './events/event.html'))
        .registerReplacer("$TITLE", event => event.title)
        .registerReplacer("$ADDITIONALCLASS", event => event.getAdditionalClasses())
        .registerReplacer("$DATE", event => event.date)
        .registerReplacer("$DAY", event => event.day)
        .registerReplacer("$MONTH", event => event.month)
        .registerReplacer("$YEAR", event => event.from.getFullYear().toString())
        .registerReplacer("$LOCATION", event => `${event.where} - ${event.date}`)
        .registerReplacer("$DESC", event => event.description ?? '');
}

export async function init() {
    const events = (await loadJsonAsync('./events/events.json')).events;

    if (!eventTemplate) {
        await initializeEventTemplateAsync();
    }

    eventWrapper = document.getElementById('event-wrapper');
    events.map(e => new Event(e))
        .filter(e => (e.to ?? e.from) > new Date())
        .groupBy(event => event.from.getFullYear())
        .forEach(renderYear);
}

Array.prototype.groupBy = function (keyFunc) {
    let dict = new Map();
    this.forEach(d => {
        const key = keyFunc(d);
        dict.set(key, [...dict.get(key) ?? [], d]);
    });
    return dict;
}

const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

export class Event {
    constructor(obj) {
        if (!obj?.title || !obj.from || !obj.where) {
            throw new Error('Can not parse an object to an event, if at least one required field ["title", "from", "where"] is missing');
        }
        this.title = obj.title;
        this.from = new Date(obj.from);
        this.to = obj.to && new Date(obj.to);
        this.tbd = obj.tbd ?? false;
        this.where = obj.where;
        this.description = obj.description ?? '';
        this.day = this.tbd ? '??' : this.from.getDate().toString().padStart(2, '0');
        this.date = this.tbd ? 'Infos folgen' : `${this.from.toLocaleDateString()}${this.to ? ` - ${this.to.toLocaleDateString()}` : ''}`;
        this.month = this.tbd ? '' : months[this.from.getMonth()];
        this.canceled = !!obj.canceled;
    }
    
    getAdditionalClasses(){
        let additionalClasses = '';
        if (this.canceled){
            additionalClasses += ' canceled';
        }
        return additionalClasses;
    }
}