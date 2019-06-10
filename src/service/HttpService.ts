import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {Http, Response,Headers, RequestOptions} from "@angular/http";
import "rxjs/add/operator/map";

@Injectable()
export class HttpService {

  constructor(private http: Http) {
  }



  post(url, postData){                             //post数据，得到response
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = new RequestOptions({
      headers: headers
    });
    return new Promise((resolve, reject) => {      //promise异步函数
      this.http.post('' + url + '', this.toQueryString(postData), options)
        .map(res => res.json())
        .subscribe(data => resolve(data), err => reject(err));
    });

  }


  private toQueryString(obj) {                        //参数序列化
    let result = [];
    for (let key in obj) {
      key = encodeURIComponent(key);
      let values = obj[key];
      if (values && values.constructor == Array) {
        let queryValues = [];
        for (let i = 0, len = values.length, value; i < len; i++) {
          value = values[i];
          queryValues.push(this.toQueryPair(key, value));
        }
        result = result.concat(queryValues);
      } else {
        result.push(this.toQueryPair(key, values));
      }
    }
    return result.join('&');
  }

  private toQueryPair(key, value) {                       //参数序列化
    if (typeof value == 'undefined') {
      return key;
    }
    return key + '=' + encodeURIComponent(value === null ? '' : String(value));
  }



  get(url) {                                                //get数据
    return new Promise(resolve => {
      this.http.get(url)
        .subscribe(res => resolve(res.json()));
    });
  }


}
