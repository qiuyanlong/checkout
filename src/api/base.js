/**
 *
 * http配置
 */
import COOKIE from './cookie'
import config from '../config/config'
// 存放公共方法，其他的放在page 各自的页面模块，同页面命名
import axios from 'axios'
// import jsonp from 'jsonp'
import qs from 'qs'
import Jsonp from './jsonp'
// import store from './store/store'
// import * as types from './store/types'
// import router from './router'

// axios 配置
axios.defaults.timeout = 300000;

axios.defaults.headers={'X-Requested-With': 'XMLHttpRequest'};
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.withCredentials = true;


// http request 拦截器
axios.interceptors.request.use(
    config => {
        let s_v2=COOKIE.get('s_v2');
        config.headers.s_v2 = s_v2;
        return config;
    },
    err => {
        // return Promise.reject(err);
    }
);
//http response 拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                // case 401:
                //     window.location.href='/logut.html';
                //     break
                // 其他 balabalabala......
            }
        }
        return Promise.reject(error.response.data)
    }
);
const httpGet = (url, params) => {
    return axios.get(url, { params: params })
}
const httpPostV2 = (url, params, cb, errcb) => {
    params.from_vue=1
    httpPost(url, params).then((res) => {
        //console.log('httpPostV2_res',res)
        if (res.data.errno == 10001 && res.data.body.redirectUrl) {
            window.location.href = res.data.body.redirectUrl + '?context_url=' + encodeURIComponent(window.location.href)

        } else if (res.data.body && cb && res.data.errno == 0) {
            cb(res.data.body)
        } else if (res.data.errno == 40001) {
            if(config.env == 'dev'){
                window.location.href='/cart.html'
            }else{
                window.location.href='/m/v2/cart.html'
            }
        } else if (res.data.errno != 0 && !res.redeidt) {
            if(errcb){
                errcb(res.data.error,res.data.errno,res.data.body)
            }
        }
    }).catch(err => {
        console.log(err)
    })
}
const httpPost = (url, formData, qsParams) => {
    var url = url;
    if (qsParams) {
        url += '?' + qs.stringify(qsParams)
    }
    return axios.post(url, qs.stringify(formData))
}

const BffPost=(url,params)=>{
    let s_v2=COOKIE.get('s_v2');
    let newParams=params||{}
    if(s_v2)newParams.s_v2=s_v2
    newParams.from_vue=1;
    return new Promise(function(resolve,reject){
        httpPost(url,newParams).then((res)=>{
            resolve(res.data.body)
        }).catch(err => {
            reject(err)
        })
    })
    
}
const httpPostAll=(paramsArr)=>{
    let ParamsArr=[];
    for(let i=0;i<paramsArr.length;i++){
        ParamsArr.push(new Promise(function(resolve,reject){
            httpPost(paramsArr[i].url,paramsArr[i].formData).then(res=>{
                
                if (res.data.errno == 10001 && res.data.body.redirectUrl) {
                    window.location.href = res.data.body.redirectUrl + '?context_url=' + encodeURIComponent(window.location.href)
        
                } else if (res.data.body && cb && res.data.errno == 0) {
                    resolve(res.data.body)
                } else if (res.data.errno == 40001) {
                    if(config.env == 'dev'){
                        window.location.href='/cart.html'
                    }else{
                        window.location.href='/m/v3/cart.html'
                    }
                } else if (res.data.errno != 0 && !res.redeidt) {
                    reject(res)
                }
                
            }).catch(err=>{
                reject(err)
            })
        }))
    }
    let allPost=Promise.all(ParamsArr);
    return allPost;
}

export { httpPost,httpPostV2,httpPostAll,BffPost,Jsonp}
