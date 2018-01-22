/**
 * pop {
 *  text: '',
 *  showTime: '',
 * }
 *
 */
import {popTips} from './pop'
import {removePopLoading} from './pop'
import {getToken} from './permission'
import port from './../../port/port'
// url， data， callback,( pop )
// 过滤登录超时， 弹窗pop{}
export default {
  // get: function (url, callback) {
  //   $.ajax({
  //     url: url,
  //     type: 'get',
  //     success: function (data) {
  //       try {
  //         switch (data.msg.status) {
  //           case 0:
  //             alert('xxx')
  //             break
  //           case 1:
  //             callback(data)
  //             break
  //           default:
  //             alert('未知的数据返回状态')
  //         }
  //       } catch (e) {
  //         e.msg = 'ajax -> get  出错'
  //         console.log(e)
  //       }
  //     },
  //     error: function (err) {
  //       err.msg = 'ajax -> get  出错 ajax self'
  //       console.log(err)
  //     }
  //   })
  // },
  post: function (url, data, callback, err0Calback) {
    $.ajax({
      url: url,
      data: data,
      type: 'post',
      beforeSend: function(xhr){
        if(url === port.login) {
          return
        } else{
          xhr.setRequestHeader('Authorization', 'Bearer ' + getToken() )
        }
      },
      success: function (data) {
        try {
          switch (data.code) {
            case 0:
              removePopLoading()
              if(err0Calback){
                err0Calback(data)
              }else{
                // 提示框
                popTips({
                  status: 0,
                  time: 3000,
                  title: data.msg
                })
                break
              }
            case 1:
              callback(data)
              break
            // 未登录
            case 2:
              removePopLoading()
              // 提示框
              popTips({
                status: 0,
                time: 2000,
                title: '未登录,即将跳转登录页...'
              })
              setTimeout(function () {
                window.location.href = '/'
              }, 600)
              break
            // 无权限
            case 3:
              removePopLoading()
              // 提示框
              popTips({
                status: 0,
                time: 1500,
                title: '抱歉, 您无权限!'
              })
              break
            default:
              removePopLoading()
              // 提示框
              popTips({
                status: 0,
                time: 1500,
                title: '未知的数据返回状态'
              })
          }
        } catch (e) {
          removePopLoading()
          e.msg = 'ajax -> post 出错'
          console.log(e)
        }
      },
      error: function (err) {
        removePopLoading()
        popTips({
          title:'加载失败',
          time: 2000,
          status: 0
        })
        err.msg = 'ajax -> post 出错 ajax self'
        console.log(err)
      }
    })
  }
}
