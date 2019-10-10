const cheerio = require('cheerio');
const _ = require('lodash');

class exHTML {

    // 删除脚本
    removeScript(html) {
        return html.replace(/<script[^>]*?>[\s\S]*?<\/script>/ig, '');
    }
    // 删除样式
    removeStyle(html) {
        return html.replace(/<style[^>]*?>[\s\S]*?<\/style>/ig, '');
    }
    // 删除链接
    removeLink(html) {
        return html.replace(/<link[^>]*?>/ig, '');
    }
    // 删除空白字符
    removeBlank(html) {
        html = html.replace(/^\s+?$/img, '');
        return html.replace(/(\r\n)+/img, '\r\n');
    }
    remove(html) {
        html = this.removeScript(html);
        html = this.removeStyle(html);
        html = this.removeLink(html);

        return this.removeBlank(html);
    }

    // 提取内容
    extractContent(
        html,
        // 包括属性中的内容
        includeAttr = false
    ) {
        const $ = cheerio.load(html);

        let contents = [];
        contents.push(this.extractTextContent($));

        if(includeAttr){
            contents.push(this.extractAttrContent($,'alt'));
            contents.push(this.extractAttrContent($,'title'));
        }
        
        return contents.join(' ').replace(/[\r\n\t ]{2,}/img, ' ');
    }

    // 提取文本的内容
    extractTextContent($) {
        let txt = $.root().text();
        return txt.replace(/<[^>]*?>/ig, '');
    }

    // 提取指定属性的内容
    extractAttrContent($,attrName){
        let result = []
        $(`[${attrName}]`).each((idx,elm)=>{
            result.push(elm.attribs[`${attrName}`]);
        })

        return result.join(' ');
    }
}

module.exports = { exHTML: new exHTML() }