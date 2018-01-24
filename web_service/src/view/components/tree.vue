<template>
    <div id='areaTree'>
        <h2>{{message}}</h2>
        <button class='btn btn-success' @click='freshArea'>我被成功引进来了吗</button>
        <div class='tree-box'>
            <div class='zTreeDemoBackground left'>
                <ul id='tree' class='ztree'></ul>
            </div>
        </div>
        <button class='btn btn-danger' @click='Print'>点击打印出全部信息</button><br/><br/>
        <div>
            <input type='text' placeholder='请输入要搜索的节点' id='ser'>&nbsp;
            <button class='btn btn-success' v-on:click='search_ztree("tree", "ser")'>搜索</button>
        </div>
    </div>
</template>
<script>
//  import 'ztree/css/zTreeStyle/zTreeStyle.css'

  export default {
    name: 'tree',
    data () {
      return {
        message: '我是tree树',
//        属性结构配置
        setting:{
//          回调函数
          callback: {
//            点击节点的回调
            onClick: this.zTreeOnClick,
//            用于捕获异步加载出现异常错误的事件的回调函数
            onAsyncError: null,
//            用于捕获异步加载正常结束的事件的回调函数
            onAsyncSuccess: null,
//            点击checkbox和radio后,捕获tid,name,以及当前勾选状态的信息
            onCheck:this.zTreeOnCheck,
//            用于捕获节点被折叠的事件回调函数
            onCollapse: this.zTreeOnCoilapse,
//            用于捕获 zTree 上鼠标双击之后的事件回调函数
            onDblClick: this.zTreeOnDblClick,
//            用于捕获节点被拖拽的事件回调函数
            onDrag: this.zTreeOnDrag,
//            拖拽节点时，随时输出 当前拖拽到的目标 DOM
            onDragMove:this.zTreeOnDragMove,
//            用于捕获节点拖拽操作结束的事件
            onDRop: this.zTreeOnDrop,
//            用于捕获节点被展开的事件回调
            onExpand: this.zTreeOnExpand,
//            用于ztree上鼠标按键按下后的事件回调
            onMouseDown:null,
//            用于ztree上鼠标按键松开后的事件回调
            onMouseUp:null,
//            用于捕获节点生成dom后的事件回调
            onNodeCreated:null,
//            用于捕获删除节点后事件的回调函数
            onRemove:null,
//            用于捕获节点编辑名称结束之后的事件的回调
            onRename:null,
//            用于捕获ztree上鼠标右键点击之后的回调
            onRightClick:null
          },
//          复选框
          check: {
//            触发自动关联勾选操作
            autoCheckTrigger: false,
//            勾选是否影响父级和自级　y表示勾选后，N表示取消勾选后的，p表示父级，s表示子集
            chkboxType: {'Y': 'ps', 'N': 'ps'},
//            勾选框类型
            chkStyle: 'radio',
//            是否显示复选框
            enable: true,
//            需要子节点自动继承nocheck=true
            nocheckInherit: false,
//            需要子节点自动继承chkDisabled=true
            chkDisabledInherit:false,
//            设置radio的判别规则为整棵树内　针对radio,属性level,all
            radioType: 'level'
          },
//          zTree数据配置模式
          data: {
            keep: {
//              子节点属性锁
              leaf: false,
//              父节点属性锁
              parent: false
            },
            key: {
//              zTree 节点数据中保存 check 状态的属性名称。
              checked: 'checked',
//              zTree 节点数据中保存子节点数据的属性名称。
              children: 'children',
//              zTree 节点数据保存节点名称的属性名称。
              name: 'name',
//              zTree 节点数据保存节点提示信息的属性名称
              title: '',
//              zTree 节点数据保存节点链接的目标 URL 的属性名称。
              url: 'url'
            },
//            确定zTree初始化时的节点数据，异步加载时的节点数据，或者addNodes方法中输入的newNodes数据是否采用简单数据模式
            simpleData: {
              enable: true,
              idKey: 'id',
              pIdKey: 'pId',
              rootPId: ''
            },
            view: {
              showIcon: false,
              dblClickExpand: false,
              showLine: true,
              selectedMulti: false,
              nameIsHTML: true
            }
          }
        },
        zNodes:[
          {
            id: 1,
            pId: 0,
            name: '[core] 基本功能 演示',
            open: true
          }, {
            id: 101,
            pId: 1,
            name: '最简单的树 --  标准 JSON 数据',
            file: 'core/standardData'
          }, {
            id: 102,
            pId: 1,
            name: '最简单的树 --  简单 JSON 数据',
            file: 'core/simpleData'
          }, {
            id: 103,
            pId: 1,
            name: '不显示 连接线',
            file: 'core/noline'
          }, {
            id: 104,
            pId: 1,
            name: '不显示 节点 图标',
            file: 'core/noicon'
          }, {
            id: 105,
            pId: 1,
            name: '自定义图标 --  icon 属性',
            file: 'core/custom_icon'
          }, {
            id: 106,
            pId: 1,
            name: '自定义图标 --  iconSkin 属性',
            file: 'core/custom_iconSkin'
          }, {
            id: 107,
            pId: 1,
            name: '自定义字体',
            file: 'core/custom_font'
          }, {
            id: 115,
            pId: 1,
            name: '超链接演示',
            file: 'core/url'
          }, {
            id: 108,
            pId: 1,
            name: '异步加载 节点数据',
            file: 'core/async'
          }, {
            id: 109,
            pId: 1,
            name: '用 zTree 方法 异步加载 节点数据',
            file: 'core/async_fun'
          }, {
            id: 110,
            pId: 1,
            name: '用 zTree 方法 更新 节点数据',
            file: 'core/update_fun'
          }, {
            id: 111,
            pId: 1,
            name: '单击 节点 控制',
            file: 'core/click'
          }, {
            id: 112,
            pId: 1,
            name: '展开 / 折叠 父节点 控制',
            file: 'core/expand'
          }, {
            id: 113,
            pId: 1,
            name: '根据 参数 查找 节点',
            file: 'core/searchNodes'
          }, {
            id: 114,
            pId: 1,
            name: '其他 鼠标 事件监听',
            file: 'core/otherMouse'
          },

          {
            id: 2,
            pId: 0,
            name: '[excheck] 复/单选框功能 演示',
            open: false
          }, {
            id: 201,
            pId: 2,
            name: 'Checkbox 勾选操作',
            file: 'excheck/checkbox'
          }, {
            id: 206,
            pId: 2,
            name: 'Checkbox nocheck 演示',
            file: 'excheck/checkbox_nocheck'
          }, {
            id: 207,
            pId: 206,
            name: 'Checkbox chkDisabled 演示',
            file: 'excheck/checkbox_chkDisabled'
          }, {
            id: 208,
            pId: 206,
            name: 'Checkbox halfCheck 演示',
            file: 'excheck/checkbox_halfCheck'
          }, {
            id: 202,
            pId: 207,
            name: 'Checkbox 勾选统计',
            file: 'excheck/checkbox_count'
          }, {
            id: 203,
            pId: 202,
            name: '用 zTree 方法 勾选 Checkbox',
            file: 'excheck/checkbox_fun'
          }, {
            id: 204,
            pId: 203,
            name: 'Radio 勾选操作',
            file: 'excheck/radio'
          }, {
            id: 209,
            pId: 204,
            name: 'Radio nocheck 演示',
            file: 'excheck/radio_nocheck'
          }, {
            id: 210,
            pId: 2,
            name: 'Radio chkDisabled 演示',
            file: 'excheck/radio_chkDisabled'
          }, {
            id: 211,
            pId: 2,
            name: 'Radio halfCheck 演示',
            file: 'excheck/radio_halfCheck'
          }, {
            id: 205,
            pId: 2,
            name: '用 zTree 方法 勾选 Radio',
            file: 'excheck/radio_fun'
          },

          {
            id: 3,
            pId: 0,
            name: '[exedit] 编辑功能 演示',
            open: false
          }, {
            id: 301,
            pId: 3,
            name: '拖拽 节点 基本控制',
            file: 'exedit/drag'
          }, {
            id: 302,
            pId: 3,
            name: '拖拽 节点 高级控制',
            file: 'exedit/drag_super'
          }, {
            id: 303,
            pId: 3,
            name: '用 zTree 方法 移动 / 复制 节点',
            file: 'exedit/drag_fun'
          }, {
            id: 304,
            pId: 3,
            name: '基本 增 / 删 / 改 节点',
            file: 'exedit/edit'
          }, {
            id: 305,
            pId: 3,
            name: '高级 增 / 删 / 改 节点',
            file: 'exedit/edit_super'
          }, {
            id: 306,
            pId: 3,
            name: '用 zTree 方法 增 / 删 / 改 节点',
            file: 'exedit/edit_fun'
          }, {
            id: 307,
            pId: 3,
            name: '异步加载 & 编辑功能 共存',
            file: 'exedit/async_edit'
          }, {
            id: 308,
            pId: 3,
            name: '多棵树之间 的 数据交互',
            file: 'exedit/multiTree'
          },

          {
            id: 4,
            pId: 0,
            name: '大数据量 演示',
            open: false
          }, {
            id: 401,
            pId: 4,
            name: '一次性加载大数据量',
            file: 'bigdata/common'
          }, {
            id: 402,
            pId: 4,
            name: '分批异步加载大数据量',
            file: 'bigdata/diy_async'
          }, {
            id: 403,
            pId: 4,
            name: '分批异步加载大数据量',
            file: 'bigdata/page'
          },

          {
            id: 5,
            pId: 0,
            name: '组合功能 演示',
            open: false
          }, {
            id: 501,
            pId: 5,
            name: '冻结根节点',
            file: 'super/oneroot'
          }, {
            id: 502,
            pId: 5,
            name: '单击展开/折叠节点',
            file: 'super/oneclick'
          }, {
            id: 503,
            pId: 5,
            name: '保持展开单一路径',
            file: 'super/singlepath'
          }, {
            id: 504,
            pId: 5,
            name: '添加 自定义控件',
            file: 'super/diydom'
          }, {
            id: 505,
            pId: 5,
            name: 'checkbox / radio 共存',
            file: 'super/checkbox_radio'
          }, {
            id: 506,
            pId: 5,
            name: '左侧菜单',
            file: 'super/left_menu'
          }, {
            id: 513,
            pId: 5,
            name: 'OutLook 风格',
            file: 'super/left_menuForOutLook'
          }, {
            id: 515,
            pId: 5,
            name: 'Awesome 风格',
            file: 'super/awesome'
          }, {
            id: 514,
            pId: 5,
            name: 'Metro 风格',
            file: 'super/metro'
          }, {
            id: 507,
            pId: 5,
            name: '下拉菜单',
            file: 'super/select_menu'
          }, {
            id: 509,
            pId: 5,
            name: '带 checkbox 的多选下拉菜单',
            file: 'super/select_menu_checkbox'
          }, {
            id: 510,
            pId: 5,
            name: '带 radio 的单选下拉菜单',
            file: 'super/select_menu_radio'
          }, {
            id: 508,
            pId: 5,
            name: '右键菜单 的 实现',
            file: 'super/rightClickMenu'
          }, {
            id: 511,
            pId: 5,
            name: '与其他 DOM 拖拽互动',
            file: 'super/dragWithOther'
          }, {
            id: 512,
            pId: 5,
            name: '异步加载模式下全部展开',
            file: 'super/asyncForAll'
          },

          {
            id: 6,
            pId: 0,
            name: '其他扩展功能 演示',
            open: false
          }, {
            id: 601,
            pId: 6,
            name: '隐藏普通节点',
            file: 'exhide/common'
          }, {
            id: 602,
            pId: 6,
            name: '配合 checkbox 的隐藏',
            file: 'exhide/checkbox'
          }, {
            id: 603,
            pId: 6,
            name: '配合 radio 的隐藏',
            file: 'exhide/radio'
          }
        ]
      }
    },
    methods:{
// 搜索文字高亮
      search_ztree (treeId, searchConditionId) {
        searchByFlag_ztree(treeId, searchConditionId, '')


        function searchByFlag_ztree(treeId, searchConditionId, flag) {
          // <1>.搜索条件
          var searchCondition = $('#' + searchConditionId).val()
          console.log(searchCondition)
          // <2>.得到模糊匹配搜索条件的节点数组集合
          var highlightNodes = new Array()
          if(searchCondition != '') {
            var treeObj = $.fn.zTree.getZTreeObj(treeId)
            highlightNodes = treeObj.getNodesByParamFuzzy('name', searchCondition, null)
          }
          // <3>.高亮显示并展示【指定节点s】
          highlightAndExpand_ztree(treeId, highlightNodes, searchCondition, flag)
        }
        function highlightAndExpand_ztree(treeId, highlightNodes, tx, flag) {
          var treeObj = $.fn.zTree.getZTreeObj(treeId)
          // <1>. 先把全部节点更新为普通样式
          var treeNodes = treeObj.transformToArray(treeObj.getNodes())
          for(var i = 0; i < treeNodes.length; i++) {
            treeNodes[i].highlight = false
            treeObj.updateNode(treeNodes[i])
          }
          // <2>.收起树, 只展开根节点下的一级节点
          close_ztree(treeId)
          // <3>.把指定节点的样式更新为高亮显示，并展开
          if(highlightNodes != null) {
            for(var i = 0; i < highlightNodes.length; i++) {
              if(flag != null && flag != '') {
                if(highlightNodes[i].flag == flag) {
                  // 高亮显示节点，并展开
                  highlightNodes[i].highlight = true
                  treeObj.updateNode(highlightNodes[i])
                  // 高亮显示节点的父节点的父节点....直到根节点，并展示
                  var parentNode = highlightNodes[i].getParentNode()
                  var parentNodes = getParentNodes_ztree(treeId, parentNode)
                  treeObj.expandNode(parentNodes, true, false, true)
                  treeObj.expandNode(parentNode, true, false, true)
                }
              } else {
                // 高亮显示节点，并展开
                // highlightNodes[i].checked = true
                var t = highlightNodes[i].name
                console.log(t)
                t = t.replace(eval('/' + tx + '/gi'), '<span style="background-color: yellow;color: red">' + tx + '</span>')
                console.log(t)
                highlightNodes[i].name = t
                treeObj.updateNode(highlightNodes[i])
                // 高亮显示节点的父节点的父节点....直到根节点，并展示
                var parentNode = highlightNodes[i].getParentNode()
                var parentNodes = getParentNodes_ztree(treeId, parentNode)
                treeObj.expandNode(parentNodes, true, false, true)
                treeObj.expandNode(parentNode, true, false, true)
              }
            }
          }
        }

        function getParentNodes_ztree(treeId, node) {
          if(node != null) {
            var treeObj = $.fn.zTree.getZTreeObj(treeId)
            var parentNode = node.getParentNode()
            return getParentNodes_ztree(treeId, parentNode)
          } else {
            return node
          }
        }
        function close_ztree(treeId) {
          var treeObj = $.fn.zTree.getZTreeObj(treeId)
          var nodes = treeObj.transformToArray(treeObj.getNodes())
          var nodeLength = nodes.length
          for(var i = 0; i < nodeLength; i++) {
            if(nodes[i].id == '0') {
              // 根节点：展开
              treeObj.expandNode(nodes[i], true, true, false)
            } else {
              // 非根节点：收起
              treeObj.expandNode(nodes[i], false, true, false)
            }
          }
        }
      },
      freshArea:function () {
//        初始化tree结构
        $.fn.zTree.init($('#tree'), this.setting, this.zNodes)
      },
//      点击打印出信息
      Print: function () {
//        获得ztree对象
        const treeObj = $.fn.zTree.getZTreeObj('tree')
//        打印出对象集合
        const getSelect = treeObj.getSelectedNodes()
//        设置后鼠标划上去，节点处于可编辑状态
        treeObj.setEditable(true)
//        将 zTree 使用的标准 JSON 嵌套格式的数据转换为简单 Array 格式。(免去用户自行编写递归遍历全部节点的麻烦)
        const getNodesToArray = treeObj.transformToArray(treeObj.getNodes())
//        将简单 Array 格式数据转换为 zTree 使用的标准 JSON 嵌套数据格式。simpleNodes是二位数组
//        const ToArrayTogetNodes = treeObj.transformTozTreeNodes(simpleNodes)
//        获取zTree的全部节点数据
        const getNodes = treeObj.getNodes()
        console.log(getNodesToArray)
      },
//      点击节点后打印出状态信息
      zTreeOnClick: function (event, treeId, treeNode) {
        console.log(treeNode.tId + ',' + treeNode.name)
      },
//      点击复选框和单选框打印出状态信息
      zTreeOnCheck: function (event, treeId, treeNode) {
        console.log(treeNode.tId+','+treeNode.name+','+treeNode.checked)
      },
//      用于捕获节点被折叠的事件回调函数
      zTreeOnCoilapse: function (event, treeId, treeNode) {
        console.log(treeNode.tId + ',' + treeNode.name)
      },
//      用于捕获节点被展开的tid,name的信息
      zTreeOnExpand: function (event, treeId, treeNode) {
        console.log(treeNode.tId + ',' + treeNode.name)
      },
//      用于捕获 zTree 上鼠标双击之后的事件回调函数
      zTreeOnDblClick: function (event, treeId, treeNode) {
        console.log(treeNode ? treeNode.tId + ',' + treeNode.name : 'isRoot')
      },
//      用于捕获节点拖拽的事件
      zTreeOnDrag: function (event, treeId, treeNodes) {
        console.log(treeNodes.length)
      },
//      拖拽节点时，随时输出 当前拖拽到的目标 DOM
      zTreeOnDragMove: function (event, treeId, treeNodes) {
        console.log(event.target)
      },
//      用于捕获节点拖拽操作结束的事件
      zTreeOnDrop: function (event, treeId, treeNodes, targetNode, moveType) {
        console.log(treeNodes.length+','+ (targetNode ? (targetNode.tId + ',' + targetNode.name) : 'isRoot' ))
      }
    }
  }
</script>
<style scoped>
    #areaTree{
        border:1px solid #e5e5e5;
        margin-bottom: 2px;
        border-radius: 4px;
        overflow: hidden;
    }
    .box-title{
        border-radius: 3px 3px 0 0;
        background-color: #f5f5f5;
    }
    .box-title a{
        color: #2fa4e7;
        text-decoration: none;
        font-size:14px;
        display: block;
        padding: 8px 15px;
        cursor: pointer;
    }
    .box-title .fa{
        float:right;
        line-height: 20px;
    }
</style>
