/**
 *
 * @param opts
 * {
 *    elem: , // 绑定的元素　ｉｄ
 *    showNum: ,  // 显示几个页码
 *    isFirst: ,  // 回到首页
 *    isLast: ,   // 最后一页
 *    isNext: ,   // 下一页
 *    isPre: ,    // 上一页
 *    isRanderTo: , //　跳转到
 *    activeClass: ,
 *    totalPage: , // 总页数
 *    callback: fun, // 回调方法
 *    callbackPop: fun //　回调弹窗　接受一个obj
 *
 * }
 */

export default function pager(opts) {
  var options = {
    elem: 'page',
    showNum: 9,  // 显示几个页码 , 请传　奇数
    isFirst: true,  // 回到首页
    isLast: true,   // 最后一页
    isNext: true,   // 下一页
    isPre: true,    // 上一页
    totalPage: 5,  // 总页数
    isRanderTo: true, //　跳转到
    activeClass: 'active',
    callback: function (page) {
      console.log(page)
    },
    callbackPop: function (data) {
      alert(data.tips)
    }
  }
  try{
    opts = opts?opts:options
  }catch (e){
    console.log(e)
  }
  if(opts.totalPage<=0){
    document.getElementById(opts.elem).innerHTML = ''

    return
  }
  if(opts.showNum%2 === 0){
    opts.callbackPop({tips: '请传奇数, 偶数开发中...'})
  }else{
    initPageStr(1)
    initClick()
  }
  // 拼接页码数字
  function initNum(page) {
    var str = '<div class="_pageNum">'
    for(var i = 1; i <= opts.showNum; i++){
      if(page === i){
        str += '<li class="' + opts.activeClass + '"><a href="javascript:;"><span>' + i + '</span></a></li>'
      }else{
        str += '<li><a href="javascript:;"><span>' + i + '</span></a></li>'
      }
    }
    str += '</div>'
    return str
  }
  // 判断页码数字是否已经初始化
  function checkNum() {
    if(document.getElementById(opts.elem)){
      return false
    }
    var arr = document.getElementById(opts.elem).getElementsByClassName('_pageNum')[0].getElementsByTagName('LI')
    if(arr.length) {return true}else{return false}
  }
  // 打印页码
  function print(str) {
    // 上一页
    var prePage = '<li><a href="javascript:;" ><span>«</span></a></li>'
    // 下一页
    var nextPage = '<li><a href="javascript:;"><span>»</span></a></li>'
    // 第一页
    var firstPage = '<li><a href="javascript:;"><span>首页</span></a></li>'
    // 最后一页
    var lastPage = '<li><a href="javascript:;"><span>末页</span></a></li>'
    // 跳转到
    var randerPage = '<li><a href="javascript:;"><span>跳转到</span></a></li>'
    var pageBox = '<ul class="_pageBox">'
    if(opts.isNext) str = str + nextPage
    if(opts.isPre) str = prePage + str
    if(opts.isLast) str = str + lastPage
    if(opts.isFirst) str = firstPage + str
    if(opts.isRanderTo) str = str + randerPage
    str = pageBox + str + '</ul>'
    document.getElementById(opts.elem).innerHTML = str
  }
  // 初始化页面DOM
  function initPageStr(page) {

    if(page == 0){
      opts.callbackPop({tips: '这是第一页'})
      return
    }
    if(page > opts.totalPage && page != 0){
      opts.callbackPop({tips: '这是尾页'})
      return
    }
    opts.callback(page)
    var str = ''
    page = parseInt(page)
    // 总页数不够 设定 页数时
    if(opts.totalPage < opts.showNum){
      for(var i = 1; i <= opts.totalPage; i++){
        if(page === i){
          str += '<li class="' + opts.activeClass + '"><a href="javascript:;"><span>' + i + '</span></a></li>'
        }else{
          str += '<li><a href="javascript:;"><span>' + i + '</span></a></li>'
        }
        print(str)
      }
      // 当总页数大于等于 设定页数
    }else{
      var status = checkNum()
      // 未初始化页码
      if(!status){
        str += initNum(page)
        print(str)
      }
      // 当前页 是 前 (showNum + 1)/2 几条的 页码初始化
      if(page <= parseInt( (opts.showNum + 1)/2 )){
        const className = document.getElementById(opts.elem).getElementsByClassName(opts.activeClass)[0].className
        document.getElementById(opts.elem).getElementsByClassName(opts.activeClass)[0].className = className.replace(new RegExp(opts.activeClass), '')
        // 切换class
        document.getElementById(opts.elem).getElementsByClassName('_pageNum')[0].getElementsByTagName('LI')[page-1].className += ' ' + opts.activeClass
        // 当前页 是 后 totalPage - (showNum+1)/2 几条的 页码初始化
      }else if(page >= opts.totalPage - parseInt( (opts.showNum + 1)/2 )){

        // 祛除  class
        for(var i = 1; i <= opts.showNum; i++){
          const className = document.getElementById(opts.elem).getElementsByClassName('_pageNum')[0].getElementsByTagName('LI')[0].className
          document.getElementById(opts.elem).getElementsByClassName('_pageNum')[0].getElementsByTagName('LI')[i - 1].className = className.replace(new RegExp(opts.activeClass), '')
        }
        // 末页变换数字
        for(var i = opts.totalPage + 1 - opts.showNum, r = 0; i <= opts.totalPage; i++, r++){
          document.getElementById(opts.elem).getElementsByClassName('_pageNum')[0].getElementsByTagName('LI')[r].getElementsByTagName('SPAN')[0].innerHTML = i
        }
        // 加class
        var len = document.getElementById(opts.elem).getElementsByClassName('_pageNum')[0].getElementsByTagName('LI').length
        for(var i = 0; i< len; i++){
          if(page === parseInt(document.getElementById(opts.elem).getElementsByClassName('_pageNum')[0].getElementsByTagName('LI')[i].innerText)){
            document.getElementById(opts.elem).getElementsByClassName('_pageNum')[0].getElementsByTagName('LI')[i].className += ' ' + opts.activeClass
          }
        }
        // 当前页 是 中间页
      }else{
        for(var i = 1; i <= opts.showNum; i++){
          document.getElementById(opts.elem).getElementsByClassName('_pageNum')[0].getElementsByTagName('LI')[i-1].getElementsByTagName('SPAN')[0].innerHTML = (page - (((opts.showNum+1)/2 - i)))
        }
        // 祛除  class
        for(var i = 1; i <= opts.showNum; i++){
          const className = document.getElementById(opts.elem).getElementsByClassName('_pageNum')[0].getElementsByTagName('LI')[0].className
          document.getElementById(opts.elem).getElementsByClassName('_pageNum')[0].getElementsByTagName('LI')[i - 1].className = className.replace(new RegExp(opts.activeClass), '')
        }
        document.getElementById(opts.elem).getElementsByClassName('_pageNum')[0].getElementsByTagName('LI')[(opts.showNum+1)/2 - 1].className +=  ' ' + opts.activeClass
      }
    }
  }
  function initClick() {
    function bindClick(e) {
      var elem = e.target ? e.target : e.srcElement
      if(elem.tagName === 'SPAN'){
        var page = elem.innerText
        if( page === '首页'){
          var prePage = parseInt( document.getElementById(opts.elem).getElementsByClassName(opts.activeClass)[0].innerText )
          if(prePage === 1) {
            opts.callbackPop({tips: '当前页即首页'})
          }else{
            initPageStr(1)
          }
        }
        if( page === '末页'){
          var prePage = parseInt( document.getElementById(opts.elem).getElementsByClassName(opts.activeClass)[0].innerText )
          if(prePage === opts.totalPage) {
            opts.callbackPop({tips: '当前页即末页'})
          }else{
            initPageStr(opts.totalPage)
          }
        }
        if( page === '»'){
          var prePage = parseInt( document.getElementById(opts.elem).getElementsByClassName(opts.activeClass)[0].innerText )
          initPageStr(prePage + 1)
        }
        if( page === '«'){
          var prePage = parseInt( document.getElementById(opts.elem).getElementsByClassName(opts.activeClass)[0].innerText )
          initPageStr(prePage - 1)
        }
        if( page === '跳转到'){
          opts.callbackPop({tips: '跳不倒'})
        }
        if((parseInt( page ) !== NaN) && parseInt( page )){
          initPageStr(parseInt( page ))
        }
      }
    }
    // 判断是否已绑定该分页
    // document.getElementById(opts.elem).removeEventListener('click', bindClick, false)
    // document.getElementById(opts.elem).addEventListener('click', bindClick, false)
    document.getElementById(opts.elem).onclick = bindClick
  }
}
