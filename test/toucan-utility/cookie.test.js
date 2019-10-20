/* eslint-disable no-undef */
const {exCookie} = require('../../libs/toucan-utility');
const expect = require('chai').expect;

describe('exCookie 测试',()=>{
    const cookieString = `ubt_ssid=16ipgad3q9nrbzduofbzdbmo6sfyqnti_2019-10-13; perf_ssid=a45yky87xe17179qcmbao8mcbc5fs8k8_2019-10-13; ut_ubt_ssid=vizvfzfzzve48rp4et7u4147uavd7i95_2019-10-13; cna=agsjFqG8IQcCAXPAvvfwRjPp; _bl_uid=4Okpw11bo1aqwIxnvyta9tkxtvtj; _utrace=905997f34d4ed522c6143b644c0ab004_2019-10-13; track_id=1571412555|c10e7951c1343ce4381087ebfb489164060b3fdeb2566782c1|89f21ac75103c5f4bc43d150bce28545; USERID=16130211; UTUSER=16130211; SID=PaZ9fW0lf8My0j5GuXC79S36DFTQ0ZGQXyUg; ZDS=1.0|1571412555|iwUj9uQFUdXH48NMMJqb8Tm9DrdwOCPH8bq3noCrvyd95JP+ZVgiMVZ/GOvUab4a; l=dBgHrxCRq-A5tfi9BOCw5uI8LobOSIRA_uPRwCYXi_5ZO6Y1OObOkGaDQFv6VjWfMQLB4cULngv9-etki84GPSFTXe47PxDc.; isg=BLa23vzv96im3IPHtNV1X8OuB-x4f_t1GU9u4SCfohk0Y1b9iGdKIRwRe3-qTPIp; tzyy=25a4d90605425eb4514f0457b6d0199c; pizza73686f7070696e67=1MkK5-oAczE99P7yXnEoaO2AALnMTZr7afhe69ov_VLgfXLNcuEdSbpLtq10GVhc`

    it('构造',()=>{
        const cookie = new exCookie(cookieString).__cookie__;
        expect(cookie.perf_ssid).to.be.eq('a45yky87xe17179qcmbao8mcbc5fs8k8_2019-10-13');
    })

    it('toString',()=>{
        const str1 = new exCookie(cookieString).toString();
        expect(str1).to.be.eq(cookieString)
    })

    it('setCookie',()=>{
        const cookie = new exCookie(cookieString);
        cookie.setCookie(['ubt_ssid=abc']);
        expect(cookie.__cookie__.ubt_ssid).to.be.eq('abc');

        cookie.setCookie('perf_ssid=123');
        expect(cookie.__cookie__.perf_ssid).to.be.eq('123');
    })
})