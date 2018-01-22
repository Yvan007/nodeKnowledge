// 创建模态框组件
/* eslint-disable camelcase */
export function addModel(obj) {
  try {
    var add = obj.add, name = obj.name, describe = obj.describe, callback = obj.callback
  } catch (e) {
    console.log(e)
    console.log('pop方法出错')
  }

  const str = '<div class="channel-modal modal" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
      '        <div class="modal-dialog">' +
      '          <div class="modal-content">' +
      '            <div class="modal-header">' +
      '              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">' +
      '                &times;' +
      '              </button>' +
      '              <h4 class="modal-title" id="myModalLabel">'+add+'</h4>' +
      '            </div>' +
      '            <div class="modal-body">' +
      '              <div class="modal-add-channel-name">' +
      '                <span>'+name+'</span>' +
      '                <input type="text" class="input-w300" placeholder="请输入名称">' +
      '              </div>' +
      '              <div class="modal-add-channel-describe">' +
      '                <span>'+describe+'</span>' +
      '                <textarea class="text-area" name="" id="" style="resize: none"></textarea>' +
      '              </div>' +
      '            </div>' +
      '            <div class="modal-footer">' +
      '              <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>' +
      '              <button type="button" class="btn btn-success" data-dismiss="submit">确定</button>' +
      '            </div>' +
      '          </div>' +
      '        </div>' +
      '      </div>'
  $('.layout-content').append(str)
  // 关闭事件
  $('[data-dismiss="modal"]').click(function () {
    $('#myModal').remove()
  })
  // submit事件
  $('[data-dismiss="submit"]').click(function () {
    callback()
  })
  $('#myModal').show()
  // 动画
  // ;(function () {
  //   var i = 1, r = 1, c = 1
  //   var timer = setInterval(function () {
  //     if(i === 24){
  //       clearInterval(timer)
  //       var timer2 = setInterval(function () {
  //         if(r === 6){
  //           clearInterval(timer2)
  //           var timer3 = setInterval(function () {
  //             if(c === 24){
  //               clearInterval(timer3)
  //             }
  //             $('#myModal .modal-footer button').css({transform: 'rotate(' + (60 - 60/(25 - c)) + 'deg)'})
  //             c++
  //           }, 28)
  //         }
  //         $('#myModal .modal-footer button').css({transform: 'rotate(' + r * 10 + 'deg)'})
  //         r++
  //       }, 18)
  //     }
  //     $('#myModal').css({backgroundColor: 'rgba(0, 0, 0, '+ 0.1 * 6/24 * i +')'})
  //     $('#myModal .modal-dialog').css({transform: 'rotate(' + i * 15 + 'deg)'})
  //     i++
  //   }, 18)
  // }())
}

// 分配模态框组件
export function distributionModel(obj) {
  try {
    var distribution = obj.dataManager, callback = obj.callback
  } catch (e) {
    console.log(e)
    console.log('distributionModel方法出错')
  }

  console.log(obj.roles)
  var rolesStr = '<ul class="role-series-1">'
  for(var i = 0; i < obj.roles.length; i++){
    rolesStr += '<li><i class="fa fa-file-o"></i>&nbsp;&nbsp;'+ obj.roles[i].username +'&nbsp;&nbsp;<input data-usename="'+obj.roles[i].username+'" value="'+ obj.roles[i].id + '" type="radio" data-id="' + obj.roles[i].role_id + '" name="role"></li>'
  }
  rolesStr += '</ul>'
  const str = '<div class="distribution-modal modal" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
      '            <div class="modal-dialog">' +
      '              <div class="modal-content">' +
      '                <div class="modal-header">' +
      '                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
      '                  <h4 class="modal-title" id="myModalLabel">分配人员</h4><hr>' +
      '                </div>' +
      '                <div class="modal-body">' +
      '                  <div class="role"><i class="role-square fa fa-plus-square-o"></i>&nbsp;&nbsp;<i class="fa fa-file-text-o"></i>&nbsp;&nbsp;角色</div>' +
      '                  <ul class="role-series">' +
      '                    <li>' +
      '                      <span class="role-series-title"><i class="role-series-square fa fa-plus-square-o"></i>&nbsp;&nbsp;<i class="fa fa-file-text-o"></i>&nbsp;&nbsp;'+distribution+'</span>' +
                             rolesStr  +
      '                    </li>' +
      '                  </ul>' +
      '                </div>' +
      '                <div class="modal-footer">' +
      '                  <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>' +
      '                  <button type="button" class="btn btn-success" data-dismiss="submit">确定</button>' +
      '                </div>' +
      '              </div>' +
      '            </div>' +
      '          </div>'
  $('.layout-content').append(str)
  // 关闭事件
  $('[data-dismiss="modal"]').click(function () {
    $('#myModal').remove()
  })
  // 点击角色展开和收缩
  $('.distribution-modal .role').click(function () {
    var roleSeries = $('.distribution-modal .role-series')
    if (roleSeries.is(':hidden')) {
      roleSeries.show()
      $('.distribution-modal .role-square').removeClass('fa-plus-square-o').addClass('fa-minus-square-o')
    } else {
      roleSeries.hide()
      $('.distribution-modal .role-square').removeClass('fa-minus-square-o').addClass('fa-plus-square-o')
    }
  })
  // 点击角色下一级展开和收缩
  $('.distribution-modal .role-series .role-series-title').click(function () {
    var roleSeries1 = $('.distribution-modal .role-series-1 li')
    if (roleSeries1.is(':hidden')) {
      roleSeries1.show()
      $('.distribution-modal .role-series-square').removeClass('fa-plus-square-o').addClass('fa-minus-square-o')
    } else {
      roleSeries1.hide()
      $('.distribution-modal .role-series-square').removeClass('fa-minus-square-o').addClass('fa-plus-square-o')
    }
  })
  // submit事件
  $('[data-dismiss="submit"]').click(function () {
    callback()
    $('.submit-model').show()
  })
  $('#myModal').show()
  // 动画
  // ;(function () {
  //   var i = 1, r = 1, c = 1
  //   var timer = setInterval(function () {
  //     if(i === 24){
  //       clearInterval(timer)
  //       var timer2 = setInterval(function () {
  //         if(r === 6){
  //           clearInterval(timer2)
  //           var timer3 = setInterval(function () {
  //             if(c === 24){
  //               clearInterval(timer3)
  //             }
  //             $('#myModal .modal-footer button').css({transform: 'rotate(' + (60 - 60/(25 - c)) + 'deg)'})
  //             c++
  //           }, 28)
  //         }
  //         $('#myModal .modal-footer button').css({transform: 'rotate(' + r * 10 + 'deg)'})
  //         r++
  //       }, 18)
  //     }
  //     $('#myModal').css({backgroundColor: 'rgba(0, 0, 0, '+ 0.1 * 6/24 * i +')'})
  //     $('#myModal .modal-dialog').css({transform: 'rotate(' + i * 15 + 'deg)'})
  //     i++
  //   }, 18)
  // }())
}

// 提示框
export function popTips(opts) {
  const imgSrc = [
    '/static/x.jpeg',
    '/static/ready.jpeg'
  ]
  /**
   *
   * @type {
   *    status: 1, // 成功or 失败
   *    title: ,
   *    tips:
   * }
   */
  var str = '<div class="_pop-tips-container"><div class="_pop-tips">' +
    ' <img src="' + imgSrc[opts.status] + '"> ' +
    (opts.title? ('<h1>' + opts.title + '</h1>') :'') +
    (opts.tips? ('<p>' + opts.tips + '</p>') :'') +
    ' </div></div>'
  $('body').append(str)
  $('._pop-tips-container').animate({opacity: 0}, opts.time?opts.time:400, function () {
    $('._pop-tips-container').remove()
  })
}


// 确认取消提示框
export function popConfirm(opts) {

  // opts ={
  //   tips: 'str',
  //   callback: 'fun'
  // }
  var str = '<div class="confirm modal"> <div class="modal-confirm"> <div class="modal-confirment"> <button type="button" class="close" data-dismiss="modal" aria-hidden="true"> </button> <div class="modal-confirmder"> <h4 class="modal-conftitle">' + opts.tips + '</h4> <button type="button" class="btn btn-default" id="removeConfirmModal">取消</button> <button type="button" class="btn btn-success" id="readySub" data-dismiss="submit">确定</button> </div> </div> </div> </div>'
  $('body').append(str)
  $('body .confirm').css({display: 'block'})
  $('#readySub').click(function () {
    opts.callback()
    $('body .confirm').remove()
  })
  $('#removeConfirmModal').click(function () {
    $('body .confirm').remove()
  })
}


// loading 框
export function popLoading() {
  var str = '<div class="_modal"><img class="_loading" src="/static/loading.gif"> ' + '</div>'
  $('body').append(str)
}

export function removePopLoading() {
  $('body ._modal').animate({opacity: 0}, 200, function () {
    $('body ._modal').remove()
  })
}

// 提示我保存
export function confirmSave() {
  window.onbeforeunload = function () {
    return '确认离开本页面?'
  }
}

// 去除提示保存
export function removeConfirmSave() {
  window.onbeforeunload = null
}
export default {
  addModel,
  distributionModel,
  popTips,
  popLoading,
  removePopLoading,
  popConfirm,
  confirmSave,
  removeConfirmSave
}
