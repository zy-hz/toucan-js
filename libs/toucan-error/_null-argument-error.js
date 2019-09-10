class NullArgumentError extends Error {
    constructor(argName) {
        super();
        this.argName = argName;
        this.message = `${argName} 不能为空`;
    }
}

module.exports = { NullArgumentError }