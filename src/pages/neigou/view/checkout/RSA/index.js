//Created in May 24, 2018 by liyingchao

import JSEncrypt from 'jsencrypt'
import Env from '@/config/env'


let RSAKEY,
	encrypt,
	b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
	b64pad = "="

function hex2b64(h) {
    var i;
    var c;
    var ret = "";
    for (i = 0; i + 3 <= h.length; i += 3) {
        c = parseInt(h.substring(i, i + 3), 16);
        ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
    }
    if (i + 1 == h.length) {
        c = parseInt(h.substring(i, i + 1), 16);
        ret += b64map.charAt(c << 2);
    }
    else if (i + 2 == h.length) {
        c = parseInt(h.substring(i, i + 2), 16);
        ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
    }
    while ((ret.length & 3) > 0) {
        ret += b64pad;
    }
    return ret;
}

JSEncrypt.prototype.encryptLong = function(string) {
  var k = this.getKey();
  var maxLength = (((k.n.bitLength()+7)>>3)-11);

  try {
    var lt = "";
    var ct = "";

    if (string.length > maxLength) {
      lt = string.match(/.{1,117}/g);
      lt.forEach(function(entry) {
        var t1 = k.encrypt(entry);
        ct += t1;
      });

      return hex2b64(ct);
    }


    var t = k.encrypt(string);
    var y = hex2b64(t);

    return y;
  } catch (ex) {
    return false;
  }
};

if(Env == 'test' || Env == 'dev'){
	RSAKEY = `-----BEGIN PUBLIC KEY-----
			  MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDleaJisPk4NEaukQ80dcg0t1nr
			  KeFq7uuZtHgarUdX7c/9NSWaulzI5kOTs3ScYShcf9dC2Cp/wXjZfRgU7TSpUePa
			  wfsUR3ypKmiRlrwj0ivjg/ZJ7ewkk5tU9S++Nfh5/MAwo8oHSemU81F1DhuaHtYu
			  g4EeOWkodk4OvMbmxwIDAQAB
			  -----END PUBLIC KEY-----`;
}else{
	RSAKEY = `-----BEGIN PUBLIC KEY-----
			  MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDKjmqg0X2NVgsXuOH1iBJbqWNR
			  +qnbBqu/6ciM7jCKItB848L6PCL1z/SdzZyWALj5xZ0UBFnLz9gfAcCo5o+kUfZ8
			  HlkCIjAFPCQGE5wR0bPeF2IK5DH5Y31HgkCOyyQvQyNsWyyBOjfRE9HEl+QEs9aU
			  gdUPDRgjyw6BqmHqlwIDAQAB
			  -----END PUBLIC KEY-----
			  `;
}

encrypt = new JSEncrypt();

encrypt.setPublicKey(RSAKEY);

export default encrypt