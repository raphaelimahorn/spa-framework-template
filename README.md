# Single Page Application - Framework template

This spa framework was originally written for this [website](https://github.com/raphaelimahorn/mg-block-website).
As new features were requested this plain frontend only framework, using github for hosting purposes and as content management system was not sufficient anymore.
For simple applications, this template can be used. This template contains a small example page.

## Technical considerations

### Design decisions

The following design decisions were made and apply for the original use case.

<dl>
<dt>No heavy backend</dt>
<dd>Use public available <i>content managment systems</i> as github pages and google calendar</dd>
<dt>Vanilla Javascript</dt>
<dd>No ussage of external libraries (except e.g. a google api or such)</dd>
<dd>reduce footprint by not using giant frameworks which handle every possible side case</dd>
<dd>do not depend on other's code</dd>
<dt>Modern features - No fallbacks</dt>
<dd>The target audience is in Switzerland, where the coverage of modern js- and css-features is satisfing.
So modern features will be used without fallbacks, since 95%+ Browser-Support in Switzerland is considered a sufficient coverage.</dd>
<dt>Semantic HTML</dt>
<dd>Use semantic html so accessibility is provided on this best effort strategy. 
No further accessibility will be provided, since this is not relevant for the target audience.</dd>
</dl>

### Framework

To register a module `<module>`, it has to be added via adding a hyperlink with a `href="#<module>"`
to <a href="src/index.html">index.html</a>. The framework will search for a js file in `./<module>/<module>.js` and a
html file with the same name in the same directory. When ever there is a navigation event (more precise, whenever
a `hashchange` event occurs), the framework does the following, considering `location.hash === '#<module>'`:

1. Open module `<module>` from cache or dynamicaly load it async
2. Call the `init` function of this method
3. If no `init` function exists or no js file can be found, the home module is loaded
4. The children of the first `main` element in the dom are replaced with whatever is contained
   in `./<module>/<module>.html`

Further the framework provides a html helper class, where one can register modules, register replacers to this templates
and then let the helper replace the placeholders in this template. e.g.

```js
HtmlHelper.registerTemplateFromString('example', '<h1>$PLACEHOLDER</h1>')
    .registerReplacer('$PLACEHOLDER', 'Hello world')
    .replace(); // yields <h1>Hello world</h1>


HtmlHelper.registerTemplateFromString('functionExample', <p>$INCREMENT</p>)
    .registerReplacer('INCREMENT', i => i + 1)
    .replace(3); // yields <p>4</p>
```

### Test Framework

To register a test class, the corresponding js-file should be linked as a module to <a href="test/test.html">
test.html</a>. The test class should look somewhat like this:

```js
// 1+ test()
test('<Testee>', () => {
    // 1+ times desc()
    desc('<testedMethod>', () => {
        // 1+ times it()
        it('should <expectedBehaviour>', () => {
            // arrange, act ...
            return Assert.<someAssertion>(/*...*/);
        });
    });
});
```

It's also possible to apply it to an array, where the elements of this array are passed as the parameter of the func of
it.

```js
[1, 2, 3].it('Should be positive', i => Assert.that(i >= 0));
```
