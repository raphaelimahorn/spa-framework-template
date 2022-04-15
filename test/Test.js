/** @typedef {Map<string, Description>} Test */
/** @typedef {Map<string, Expectation | ExpectationsWithParam>}  Description */
/** @typedef {{desc: string, func: function:Result }} Expectation */
/** @typedef {{desc: string, exps: Map<any, function:Result> }} ExpectationsWithParam */

/** @type Test | undefined */
let tTest;

/** @type Description | undefined */
let tDesc;

let expectations = 0;
let failed = 0;
let succeeded = 0;
let thrown = 0;

export function test(description, func) {
    tests.has(description) || tests.set(description, new Map());
    tTest = tests.get(description);
    func();
    tTest = undefined;
}

/**
 * @param description {string}
 * @param func {function}
 */
export function desc(description, func) {
    tTest.has(description) || tTest.set(description, new Map());
    tDesc = tTest.get(description);
    func();
    tDesc = undefined;
}

/**
 * @param desc {string}
 * @param func {function:Result}
 */
export function it(desc, func) {
    tDesc.set(desc, {desc, func});
    expectations++;
}

/**
 * @param param {T}
 * @param desc {string}
 * @param func {function(T):Result}
 * @template T
 */
function itWithParam(param, desc, func) {
    if (!tDesc.has(desc)) tDesc.set(desc, {desc, exps: new Map()});
    let expectationWithParams = tDesc.get(desc);
    expectationWithParams.exps.set(param, func);
}

Array.prototype.it = function (desc, func) {
    expectations++;
    this.forEach(element => itWithParam(element, desc, func));
}


/** @type {Map<string, Map<string, Description>>} */
let tests = new Map();

let body;

export function run() {
    body = document.getElementsByTagName('body')[0];
    tests.forEach((descs, name) => {
        let html = '<div class="test">';
        html += `<h2>${name}</h2>`;
        descs.forEach((exp, desc) => {
            html += `<h3>${desc}</h3>`;
            exp.forEach(e => {
                try {
                    html += !e.exps
                        ? handleIt(e)
                        : handleItWithParam(e)

                } catch (ex) {
                    console.warn(ex);
                    html += `<p class="failed">${e.desc}: failed: test throw unexpectedly`;
                    thrown++;
                }
            });
        });
        body.insertAdjacentHTML('beforeend', '<hr>' + html + '</div>');
    });
    body.insertAdjacentHTML('afterbegin', `<p class="summary ${failed + thrown ? 'failed' : 'passed'}">run ${expectations} Tests: 
<span><span class="passing">${succeeded}</span> passed</span>
<span><span class="failing">${failed}</span> failed</span>
<span><span class="throwing">${thrown}</span> threw unexpectedly</span>
</p>`)
}

function handleIt(e) {
    const result = e.func();
    result.isSuccessful ? succeeded++ : failed++;
    return `<p class=${result.isSuccessful ? 'passed' : 'failed'}>${e.desc}: ${result.isSuccessful ? 'passed' : `failed: 
    ${result.failureMsg}`}</p>`;
}

function handleItWithParam(e) {
    let success = true;
    let failing = [];
    e.exps.forEach((func, param) => {
        // TODO try catch
        const result = func(param);
        success &&= result.isSuccessful;
        if (!result.isSuccessful) {
            failing = [...failing, {param, msg: result.failureMsg}];
        }
    });
    success ? succeeded++ : failed++;
    let failureMsg = `failed ${failing.length} subtests:`
    failing.forEach(fail => failureMsg += `<p class="subtest">with: ${JSON.stringify(fail.param)} -> ${fail.msg}</p>`);

    return `<p class=${success ? 'passed' : 'failed'}>${e.desc}: ${success ? `passed ${e.exps.size} subtests` : failureMsg}</p>`;
}
