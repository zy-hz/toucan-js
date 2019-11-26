/* eslint-disable no-undef */
const expect = require('chai').expect;
const lib = require('rewire')('../../libs/toucan-utility/_git');
const analyzeResponse = lib.__get__('analyzeResponse');
const { gitState } = require('../../libs/toucan-utility');

describe('[测试入口] - git', () => {

    describe('analyzeResponse', () => {
        it('updateDone', () => {
            const response = `Updating 3ce4dae..09d2e49
            Fast-forward
             README.md           | 12 +++++++++---
             ecosystem.config.js |  6 +++---
             2 files changed, 12 insertions(+), 6 deletions(-)`;

            expect(analyzeResponse(response)).to.be.eq(gitState.updateDone);
        })

        it('isNew', () => {
            const response = `Already up to date.
            `;
            expect(analyzeResponse(response)).to.be.eq(gitState.isNew);
        })

    })
})