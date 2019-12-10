const cheerio = require('cheerio');
const _ = require('lodash');
const parse = require('url-parse');

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

        if (includeAttr) {
            contents.push(this.extractAttrContent($, 'alt'));
            contents.push(this.extractAttrContent($, 'title'));
        }

        return contents.join(' ').replace(/[\r\n\t ]{2,}/img, ' ');
    }

    // 提取文本的内容
    extractTextContent($) {
        let txt = $.root().text();
        return txt.replace(/<[^>]*?>/ig, '');
    }

    // 提取指定属性的内容
    extractAttrContent($, attrName) {
        let result = []
        $(`[${attrName}]`).each((idx, elm) => {
            result.push(elm.attribs[`${attrName}`]);
        })

        return result.join(' ');
    }

    // 提取超连接
    extractHyperlink(html, {
        // 忽略没有文字的标签
        ignoreNullText = true,
        // 忽略#
        ignoreSelfHref = true,
        // 忽略外部连接
        ignoreOuterHref = true,
        // 指定主机，可以包括端口，例如： foo.com:81，如果指定主机，所有相对连接都会加入主机
        baseUrl = '',

    } = {}) {

        const $ = cheerio.load(html);
        const ary = [];
        _.forEach($('body a'), a => {

            const obj = this.filterHyperlink($(a), { ignoreNullText, ignoreSelfHref, ignoreOuterHref, baseUrl })
            if (!_.isNil(obj)) ary.push(obj);
        });
        return ary;
    }

    // 过滤超连接
    filterHyperlink($, { ignoreNullText, ignoreSelfHref, ignoreOuterHref, baseUrl }) {
        const aHref = $.attr('href');
        const aText = this.removeBlank($.text());

        if (_.isEmpty(aHref)) return undefined;
        if (ignoreNullText && _.isEmpty(aText)) return undefined;
        if (ignoreSelfHref && aHref === '#') return undefined;

        const url = parse(aHref, baseUrl);
        if (ignoreOuterHref && url.hostname != parse(baseUrl).hostname) return undefined;
        return { aHref: url.toString(), aText };
    }
}

module.exports = { exHTML: new exHTML() }