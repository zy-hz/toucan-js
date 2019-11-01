class RunnerA {

    start() {
        console.log('我是A，启动了');
    }

    stop() {
        console.log('A停止了');
    }

}

module.exports = new RunnerA();
