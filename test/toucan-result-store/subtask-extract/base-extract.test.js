/* eslint-disable no-undef */
const extractClass = require('../../../libs/toucan-result-store/subtask-extract/base-extract');
const expect = require('chai').expect;

describe('[测试入口] - base sub task extractor', () => {
    const extractor = new extractClass();

    it('bodani index', () => {
        const { task, page } = require('../sample/regain-result-bodani-index.json')
        const result = extractor.extract(task, page);
        expect(result).lengthOf(99);
    })

})