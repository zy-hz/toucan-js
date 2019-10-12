/* eslint-disable no-undef */
const expect = require('chai').expect;
const mqvCreate = require('../../libs/toucan-mq-visitor');
const lib = require('rewire')('../../libs/toucan-mq-visitor/_file-mq-visitor');
const DEFAULT_CACHE_PATH = lib.__get__('DEFAULT_CACHE_PATH');

const fs = require('fs');

describe('FileMQVisitor 测试 temp',()=>{
    describe('init',()=>{
        it('default path',()=>{
            const mqv = mqvCreate('file');
            expect(fs.existsSync(DEFAULT_CACHE_PATH),'DEFAULT_CACHE_PATH').is.true;
        })
    })
})