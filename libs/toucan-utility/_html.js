class exHTML {

    // 删除脚本
    removeScript(html){
        return html.replace(/<script[^>]*?>[\s\S]*?<\/script>/ig, '');
    }
    // 删除样式
    removeStyle(html){
        return html.replace(/<style[^>]*?>[\s\S]*?<\/style>/ig, '');
    }
    // 删除链接
    removeLink(html){
        return html.replace(/<link[^>]*?>/ig, '');
    }
    // 删除空白字符
    removeBlank(html){
        html= html.replace(/^\s+?$/img, '');
        return html.replace(/(\r\n)+/img, '\r\n');
    }
    remove(html){
        html = this.removeScript(html);
        html = this.removeStyle(html);
        html = this.removeLink(html);

        return this.removeBlank(html);
    }
}

module.exports = { exHTML: new exHTML() }