export class Assert {
    /**
     * @param func {function:boolean}
     * @param msg {string?} a message displayed in failure case
     */
    static that(func, msg) {
        return new Result(func(), msg ?? '');
    }

    static isEqual(actual, expected, msgPrefix = '') {
        return actual === expected ? Result.success() : Result.fail(`${msgPrefix}
    Expected: ${JSON.stringify(expected)}
    Got: ${JSON.stringify(actual)}`);
    }

    /**
     * @param func {function}
     * @param msg {string?} the expected error message
     */
    static throws(func, msg) {
        try {
            func();
        } catch (e) {
            if (!!msg) {
                return Assert.isEqual(e.message, msg, 'expected a different error message');
            }
            return Result.success();
        }
        return Result.fail(msg ?? 'expected function to throw');
    }

    static doesntThrow(func, msg) {
        try {
            func();
            return Result.success();
        } catch (e) {
            return Result.fail(msg ?? 'expected function not to throw');
        }
    }

    static isEmptyString(testee, msg) {
        return testee === ''
            ? Result.success()
            : Result.fail(msg ?? `expected empty string, got: ${testee}`);
    }

    static isFalse(testee, msgPrefix) {
        return Assert.isEqual(testee, false, msgPrefix);
    } 
    
    static isSameDate(actual, expected, msgPrefix){
        return Assert.isEqual(actual.toISOString(), expected.toISOString(), msgPrefix);
    }
}

export class Result {

    /** @type boolean */
    isSuccessful;
    /** @type string | undefined */
    failureMsg;

    constructor(isSuccessful, failureMsg = undefined) {
        this.isSuccessful = isSuccessful;
        this.failureMsg = failureMsg;
    }

    static success() {
        return new Result(true);
    }

    static fail(failureMsg = '') {
        return new Result(false, failureMsg)
    }
}
