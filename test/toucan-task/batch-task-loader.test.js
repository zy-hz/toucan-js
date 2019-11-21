/* eslint-disable no-undef */
const loader = require('../../libs/toucan-task/batch-task-loader');
const lib = require('rewire')('../../libs/toucan-task/batch-task-loader');
const convertRow2Task = lib.__get__('convertRow2Task');
const path = require('path');
const expect = require('chai').expect;

describe('[测试入口] - batch task loader', () => {

    const batchFormat = {
        lineSplitChar: ';',
        lineFields: [
            'productId',
            'memberId',
            'shopUrl'
        ],
        targetUrl: 'http://detail.1688.com/offer/${productId}.html'
    }
    // 分割参数
    const partition = {
        // 分区数量
        segmentCount: 3,
        // asc | desc | null
        order: 'asc'
    }

    const contentFile = path.resolve(__dirname, 'sample', '1688.v2.txt');

    it('convertRow2Task', () => {
        const task = convertRow2Task('537100955379;b2b-1800563792;https://shop1377881866966.1688.com', ';', batchFormat.lineFields,
            'http://detail.1688.com/offer/${productId}.html_${1}');
        expect(task.productId, 'productId').to.be.eq('537100955379')
        expect(task.memberId, 'memberId').to.be.eq('b2b-1800563792')
        expect(task.shopUrl, 'shopUrl').to.be.eq('https://shop1377881866966.1688.com')
    })

    it('load segmentCount', () => {
        partition.segmentCount = 2;
        let tasks = loader.load(contentFile, batchFormat, partition);
        // 被分割为两个批次
        expect(tasks).have.lengthOf(partition.segmentCount);

        partition.segmentCount = 3;
        tasks = loader.load(contentFile, batchFormat, partition);
        // 被分割为两个批次
        expect(tasks).have.lengthOf(partition.segmentCount);
    })

})