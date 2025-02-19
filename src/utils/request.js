import axios from 'axios'
import qs from "qs";
import { apiUrl } from './config'
import store from '@/store/index';

const instance = axios.create({
    baseURL: apiUrl,
    timeout: 10000
})

export const get = async (url, data = {}) => {
    let res = await initRequestHeader('get', url, data);
    data = res.data;
    return new Promise((resolve, reject) => {
        instance.get(res.url, { params: data, headers: res.headers }).then((response) => {
            if (response.data.state == 266) {
                store.commit('clearAllData')
                // window.location.href = '/login';
                // window.reload();
                store.state.loginState=1
            } else if (response.data.state == 270) {
                response.data.msg = '操作失败，输入的文本包含敏感信息' + response.data.msg + '，请修改后重新操作'
                resolve(response.data)
            } else {
                resolve(response.data)
            }
        }, err => {
            reject(err)
        })
    })
}

export const post = async (url, data = {}, type = 'urlencoded') => {
    let res = await initRequestHeader('post', url, data, type);
    return new Promise((resolve, reject) => {
        instance.post(res.url, res.data, {
            headers: res.headers
        }).then((response) => {
            if (response.data.state == 266) {
                store.commit('clearAllData')
                // window.location.href = '/login';
                // window.reload();
                store.state.loginState=1
            } else if (response.data.state == 270) {
                response.data.msg = '操作失败，输入的文本包含敏感信息' + response.data.msg + '，请修改后重新操作'
            }
            resolve(response.data)
        }, err => {
            reject(err)
        })
    })
}

/**
 * 初始化请求头和数据
 * @zjf-2020-12-25
 */
const initRequestHeader = async (method, url, data = {}, type = 'urlencoded') => {
    let result = {};
    let headers = {};

    //用户登录状态下，每次更新refresh_token58分钟之后需要更新access_token
    let { accessToken, refreshToken } = store.getters
    let { time } = store.state.tokenInfo
    if (accessToken) {
        let cur_time = new Date().getTime();
        if (cur_time - Number(time) * 1 > 58 * 60 * 1000) {
            // let param = new FormData();
            // param.append('grant_type', 'refresh_token');
            // param.append('refreshToken', refreshToken);
            const param = {
                grant_type: 'refresh_token',
                refreshToken
            }
            await instance.post('v3/channelLogin/oauth/token', param, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((response) => {
                if (response.data.state == 200) {
                    store.commit('loginUpdate', {
                        access_token: response.data.data.access_token,
                        refresh_token: response.data.data.refresh_token,
                        time: new Date().getTime().toString()
                    })
                }
            }, err => {
                console.log('更新access_token出错：', err);
            })
        }
    }

    if (method == 'post') {
        if (type == 'urlencoded') {
            headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
            data = qs.stringify(data);
        } else if (type == 'json') {
            headers = { 'Content-Type': 'application/json' };
            data = JSON.parse(JSON.stringify(data));
        } else if (type == 'form') {//form-data
            headers = { 'Content-Type': 'multipart/form-data' };
            let tmp_data = new FormData();
            Object.keys(data).forEach((item) => {
                tmp_data.append(item, data[item])
            });
            data = tmp_data;
        }
    }

    if (url.indexOf('channelLogin/oauth/token') == -1) {
        headers.Authorization = 'Bearer ' + accessToken;
    }

    //用户登录终端来源：1、PC
    headers['Terminal-source'] = 1;
    const curLang = localStorage.getItem('curLang') ? localStorage.getItem('curLang') : 'pt'; //默认葡语
    headers.Language = curLang
    result = { url, data, headers };
    return result;
}
