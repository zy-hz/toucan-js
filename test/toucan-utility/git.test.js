/* eslint-disable no-undef */
const expect = require('chai').expect;
const lib = require('rewire')('../../libs/toucan-utility/_git');
const analyzeResponse = lib.__get__('analyzeResponse');
const { gitState } = require('../../libs/toucan-utility');

describe('[测试入口] - git', () => {

    describe('analyzeResponse', () => {
        it('updateDone 1', () => {
            const response = `Updating 3ce4dae..09d2e49
            Fast-forward
             README.md           | 12 +++++++++---
             ecosystem.config.js |  6 +++---
             2 files changed, 12 insertions(+), 6 deletions(-)`;

            expect(analyzeResponse(response)).to.be.eq(gitState.updateDone);
        })

        it('updateDone 2', () => {
            const response = `更新 4f95fd0..851e18f
            Fast-forward
             test.txt | 1 -
             1 file changed, 1 deletion(-)
             delete mode 100644 test.txt`;

            expect(analyzeResponse(response)).to.be.eq(gitState.updateDone);
        })

        it('updateDone 3', () => {
            const response = `更新 746f916..4f95fd0
            Fast-forward
             libs/toucan-app/auto-upgrade.js | 1 -
             libs/toucan-utility/_git.js     | 1 +
             test.txt                        | 1 +
             3 files changed, 2 insertions(+), 1 deletion(-)
             create mode 100644 test.txt`;

            expect(analyzeResponse(response)).to.be.eq(gitState.updateDone);
        })

        it('isNew', () => {
            const response = `Already up to date.
            `;
            expect(analyzeResponse(response)).to.be.eq(gitState.isNew);
        })

    })
})