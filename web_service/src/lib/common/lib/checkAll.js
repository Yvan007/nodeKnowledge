export default function checkAll (obj){
  $(obj.elem).change(function(){
    ($(obj.elem)[0].checked)
      ?($(obj.inputGroup + ' input').each(function(){this.checked = true}))
      :($(obj.inputGroup + ' input').each(function(){this.checked = false}))
  })
  $(obj.inputGroup).on('change', 'input', function(){
    var status = 0;
    (this.checked)
      ?((function(){for(var i = 0 ; i<$(obj.inputGroup + ' input').length ; i++) {(!$(obj.inputGroup + ' input')[i].checked)&&(status = 1)}(!status)&&( $(obj.elem)[0].checked = true)}()))
      :($(obj.elem)[0].checked = false)
  })
}

