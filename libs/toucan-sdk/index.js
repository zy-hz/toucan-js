//
// toucan wep-api 的开发工具
//

const _ = require('lodash');
const fs = require('fs');
const path = require('path');

// 影射目录为模块
function mapDirToModule(d) {
    const tree = {}

    // 获得当前文件夹下的所有的文件夹和文件
    const [dirs, files] = _(fs.readdirSync(d)).partition(p => fs.statSync(path.join(d, p)).isDirectory())

    // 映射文件夹
    dirs.forEach(dir => {
        tree[dir] = mapDirToModule(path.join(d, dir))
    })

    // 映射文件
    files.forEach(file => {
        if (_.startsWith(file, '_') && path.extname(file) === '.js') {
            const obj = require(path.join(d, file));
            if (_.isFunction(obj)) {
                // 这是一个函数，使用文件名（去掉前导的下划线）
                tree[_.trimStart(path.basename(file, '.js'), '_')] = obj;
            }

            // 将来，这里可以加入对于类的处理
        }
    })

    return tree
}


module.exports = mapDirToModule(__dirname);