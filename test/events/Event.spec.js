import {desc, it, test} from "../Test.js";
import {Event} from "../../src/events/events.js";
import {Assert} from "../Assert.js";

const expectedFailureMsg = 'Can not parse an object to an event, if at least one required field ["title", "from", "where"] is missing';
const minimalEvent = {title: 'title', from: '2021-01-21', where: 'switzerland'};

test('Event', () => {
    desc('Constructor should throw if required field is missing', () => {
        it('empty object', () => Assert.throws(() => new Event(), expectedFailureMsg));

        it('title missing', () => Assert.throws(() => new Event({
            from: '2021-01-21',     
            where: 'tbd'
        }), expectedFailureMsg));

        it('where missing', () => Assert.throws(() => new Event({
            title: 'title',
            from: '2021-01-21',
        }), expectedFailureMsg));

        it('from missing', () => Assert.throws(() => new Event({
            title: 'title',
            where: 'tbd'
        }), expectedFailureMsg));

        it('should not throw if all required fields are set', () => Assert.doesntThrow(() => new Event(minimalEvent)));
    });

    desc('Constructor parses correctly', () => {
        it('title', () => {
            const expectedTitle = 'Some event title';
            const actualTitle = new Event({...minimalEvent, title: expectedTitle}).title;
            return Assert.isEqual(actualTitle, expectedTitle);
        });

        it('where', () => {
            const expected = 'Bern';
            const actual = new Event({...minimalEvent, where: expected}).where;
            return Assert.isEqual(actual, expected);
        });

        it('from yyyy-MM-dd', () => {
            const expected = new Date(Date.UTC(2021, 6, 21));
            const actual = new Event({...minimalEvent, from: '2021-07-21'}).from;
            return Assert.isSameDate(actual, expected);
        });
        
        it('from yyyy-MM-dd hh:mm:ss', () => {
            const expected = new Date(2021, 6, 21, 18, 0, 1);
            const actual = new Event({...minimalEvent, from: '2021-07-21 18:00:01'}).from;
            return Assert.isSameDate(actual, expected);
        });
        
        it('to yyyy-MM-dd', () => {
            const expected = new Date(Date.UTC(2021, 6, 21));
            const actual = new Event({...minimalEvent, to: '2021-07-21'}).to;
            return Assert.isSameDate(actual, expected);
        });
        
        it('to yyyy-MM-dd hh:mm:ss', () => {
            const expected = new Date(2021, 6, 21, 18, 0, 1);
            const actual = new Event({...minimalEvent, to: '2021-07-21 18:00:01'}).to;
            return Assert.isSameDate(actual, expected);
        });
        
        it('description', () => {
            const expected = 'some description';
            const actual = new Event({...minimalEvent, description: expected}).description;
            return Assert.isEqual(actual, expected);
        });
        
        it('tbd true', () => {
            const expected = true;
            const actual = new Event({...minimalEvent, tbd: expected}).tbd;
            return Assert.isEqual(actual, expected);
        });
        
        it('tbd false', () => {
            const expected = true;
            const actual = new Event({...minimalEvent, tbd: expected}).tbd;
            return Assert.isEqual(actual, expected);
        });
    });

    desc('Constructor uses defaults if necessary', () => {
        it('description', () => Assert.isEmptyString(new Event(minimalEvent).description));
        it('to', () => Assert.isEqual(new Event(minimalEvent).to, undefined));
        it('tbd', () => Assert.isFalse(new Event(minimalEvent).tbd));
    });

    desc('Constructor calculates calculated values correctly', () => {
        it('month', () => Assert.isEqual(new Event({...minimalEvent, from: '2021-08-01'}).month, 'August'));

        it('day in case of tbd', () => {
            const event = {...minimalEvent, tbd: true, from: '2021-08-01'};
            return Assert.isEqual(new Event(event).day, '??');
        });

        it('day in case of not tbd', () => {
            const event = {...minimalEvent, tbd: false, from: '2021-08-01'};
            return Assert.isEqual(new Event(event).day, '01');
        });

        it('date in case of tbd', () => {
            const event = {...minimalEvent, tbd: true, from: '2021-08-01'};
            return Assert.isEqual(new Event(event).date, 'Infos folgen');
        });
        
        it('date without to', () => {
            const event = {...minimalEvent, from: '2021-08-01'};
            return Assert.isEqual(new Event(event).date, '1.8.2021');
        });    
        
        it('date with to', () => {
            const event = {...minimalEvent, from: '2021-08-01', to: '2021-08-03'};
            return Assert.isEqual(new Event(event).date, '1.8.2021 - 3.8.2021');
        });
    });
});