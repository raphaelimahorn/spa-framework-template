import {HtmlHelper} from '../../src/framework/htmlHelper.js';
import {desc, it, test} from '../Test.js';
import {Assert} from '../Assert.js';


test('HtmlHelper', () => {
    desc('test', () => {
        it('should create', () => {
            return Assert.that(() => !!new HtmlHelper());
        });
    });

    desc('registerTemplateFromString', () => {
        it('should return a template', () => {
            const template = '<div></div>';
            const result = HtmlHelper.registerTemplateFromString('test1', '<div></div>');
            return Assert.that(() => result.template === template && result.replacements.size === 0);
        });
    });

    desc('fillInTemplate', () => {
        it('should work properly', () => {
            const template = '<p>$HELLO</p>';
            HtmlHelper.registerTemplateFromString('h', template)
                .registerReplacer('$HELLO', 'world');

            const result = HtmlHelper.fillInTemplate('h', undefined);
            return Assert.isEqual(result, '<p>world</p>');
        });
    });
});

test('Template', () => {
    const template = '<div>$TEST</div>';

    let i = 2;
    const RegisterTemplate = () => HtmlHelper.registerTemplateFromString('test' + i++, template);
    const AssertIsTemplate = t => Assert.isEqual(t.template, template);
    desc('registerReplacer', () => {
        it('should return the template', () => {
            const result = RegisterTemplate().registerReplacer('$TEST', _ => 'test');
            return AssertIsTemplate(result);
        });
    });

    desc('replace', () => {
        it('should return template, if no replace is registered', object => {
            const result = RegisterTemplate().replace(object);
            return Assert.isEqual(result, template);
        });

        it('should return template, if no matching replacer is registered', () => {
            const result = RegisterTemplate().registerReplacer('$NONE', 'do something').replace(undefined);
            return Assert.isEqual(result, template);
        });

        it('should replace value const in value type replacer', () => {
            const result = RegisterTemplate().registerReplacer('$TEST', 'XYZ').replace(undefined);
            return Assert.isEqual(result, '<div>XYZ</div>');
        });

        it('should replace value const in action type replacer', () => {
            const result = RegisterTemplate().registerReplacer('$TEST', () => 'ABC').replace(undefined);
            return Assert.isEqual(result, '<div>ABC</div>');
        });

        it('should replace value const in func type replacer', () => {
            const date = new Date(2021, 6, 7);
            const result = RegisterTemplate().registerReplacer('$TEST', d => d.getFullYear().toString()).replace(date);
            return Assert.isEqual(result, '<div>2021</div>');
        });

        it('should throw when func type missmatch replacer', () => {
            const date = '2021-06-07';
            const template = RegisterTemplate().registerReplacer('$TEST', d => d.getFullYear().toString());
            return Assert.throws(() => template.replace(date));
        });
    });
});