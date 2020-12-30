import axios from 'axios';
import {Message} from 'element-ui';
import maskUtil from './MaskUtil';
import router from '../../router';

axios.defaults.timeout = 30000;
// 设置默认URL
axios.defaults.baseURL = 'https://www.yinhuachaoshi.com/order';//线上
// axios.defaults.baseURL = 'http://test123.ayznscm.com/order';
// axios.defaults.baseURL = 'http://192.168.1.115:9999/'//线下
// 设置post请求内容类型，编码格式
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

// http 请求拦截
axios.interceptors.request.use(
  config => {
    // config.data = JSON.stringify(config.data);
    config.headers.token = localStorage.getItem('token');
    config.header = {
      'Content-Type':'application/x-www-form-urlencoded',
    }
    maskUtil.open();
    return config
  },
  error => {``
    Message({message: '请求超时', type: 'error'});
    return Promise.reject(error);
  }
);

// http 响应拦截拦截
axios.interceptors.response.use(
  response => {
    switch(response.data.code){
      case 9:
        Message({message: '您还未登录！', type: 'error'});
        //进识图
        router.push({
          path:'/picLogin'
        })
        break;
      // case 7:
      //   Message.error({message: '请勿重复提交!'})
      //   break;
      case -1:
        Message.error({message: response.data.message, type: 'error'})
        break;
      case 8:
        Message.error({message:response.data.message})
        break;
      case 100:
        return ;
        break;
      default:
        break;
    }
    maskUtil.close()
    return response;
  },
  error => {
    maskUtil.close()
    return Promise.reject(error)
  }
)

// http请求封装
// get方法
export function get(url,params = {}){
  return new Promise((resolve,reject) => {
    axios.get(url,{
      params:params
    }).then(res => {
      if(res.data.code == 0){
        resolve(res.data);
      }
    }).catch(err=> {
      reject(err);
      Message({message: '加载失败', type: 'error'});
    })
  })
}
// post方法
export function post(url,params){
  let formData = new FormData();
  Object.keys(params).forEach(key => {
    formData.append(key,params[key])
  })
  return new Promise((resolve,reject) => {
    axios.post(url,formData).then(res => {
      if(res.data.code == 0){
        resolve(res.data);
      }
    }).catch(err => {
      reject(err)
      Message({message: '加载失败', type: 'error'});
    })
  })
}

// put方法
export function put(url,params){
  let formData = new FormData();
  Object.keys(params).forEach(key => {
    formData.append(key,params[key])
  })
  return new Promise((resolve,reject) => {
    axios.put(url,formData).then(res => {
      if(res.data.code == 0){
        resolve(res.data);
      }
    }).catch(err => {
      reject(err);
      Message({message: '加载失败', type: 'error'});
    });
  })
}
// delete方法
export function deletefn(url, params) {
  let formData = new FormData();
  Object.keys(params).forEach(key =>{
    formData.append(key,params[key])
  })
  return new Promise((resolve, reject) => {
      axios.delete(url, {data:formData})
          .then(res => {
            if(res.data.code == 0){
              resolve(res.data);
            }
          })
          .catch(err => {
              reject(err.data)
              Message({message: '加载失败', type: 'error'});
          })
  });
}
