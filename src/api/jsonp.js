/*
 * @Author: HW.Liang 
 * @Date: 2018-05-30 13:30:02 
 * @Last Modified by: HW.Liang
 * @Last Modified time: 2018-07-02 10:40:29
 */
const config = {
    callback: 'callback',
}

function generateCB() {
    let lowercase = ["a","b","c","d","e","f","g","h","i","g","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    let lowercaseStr='';
    let len=lowercase.length
    var m=lowercase[parseInt(Math.random() * len)].toUpperCase();
    var n=lowercase[parseInt(Math.random() * len)]
    return `jsonp_neigou_vue_mpbile_v3_${Math.ceil(Math.random() * 100000)}${n}${m}`;
}

function removeCB(_name) {
    try {
        delete window[_name];
    } catch (e) {
        window[_name] = undefined;
    }
}

function createScript(_url, _id) {
    const script = document.createElement('script');
    script.setAttribute('src', _url);
    script.id = _id;
    document.getElementsByTagName('head')[0].appendChild(script);
}

function removeScipt(_id) {
    const script = document.getElementById(_id);
    document.getElementsByTagName('head')[0].removeChild(script);
}

function Jsonp(_url, params = {}, options = {}) {
    return new Promise((resolve, reject) => {
        const jsonp = options.callback || config.callback,
            cb = generateCB(), // get callback function name
            scriptId = cb;
        
        let query = [];
        Object.keys(params).forEach(key => {
            query.push(`${key}=${params[key]}`);
        })
        _url = _url.indexOf("?") > 0 ? (_url + "&") : (_url + "?");
        _url += (query.length === 0) ? '' : `${query.join('&')}`;
        _url += `&${jsonp}=${cb}`;
        window[cb] = (res) => {
            resolve(res);
            removeScipt(scriptId);
            removeCB(cb);
        }

        createScript(_url, scriptId);
    })
}

export default Jsonp