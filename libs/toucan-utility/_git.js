//
// git的相关操作
//
const { execFileSync } = require('child_process');
const fs = require('fs');

const gitState = {
    // 最新版本
    isNew: 'isNew',
    // 更新完成
    updateDone: 'updateDone',
    // 过程错误
    processError: 'processError',
}

function gitPull({ workDir } = {}) {
    if (!fs.existsSync(workDir)) throw Error(`工作目录不存在：${workDir}`);
    const response = execFileSync(`git`, ['pull'], { cwd: workDir }).toString();

    const state = analyzeResponse(response);
    return { state, response };
}

// 分析git的响应
function analyzeResponse(response) {
    if (/already up to date/im.test(response)) return gitState.isNew;
    if (/fast-forward/im.test(response)) return gitState.updateDone;

    return gitState.processError;
}

module.exports = { gitPull, gitState }