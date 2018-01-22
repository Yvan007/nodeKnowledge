<template>
    <div class="confirm">
        <div class="xconfirm">
            <div class="close">x</div>
            <div class="xconfirmbox">
                <h4>确定删除吗？</h4>
                <button class="btn btn-danger" data-dismiss="modal" > 确定</button>
                <button class="btn btn-success" data-dismiss="submit">取消</button>
            </div>
        </div>
    </div>
</template>

<script>

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h4{margin-top: 0}
    .confirm{
        position: fixed;
        left: 0;
        top:0;
        right:0;
        bottom: 0;
        background-color: rgba(0, 0, 0, .6);
    }
    .confirm .xconfirm{
        width: 450px;
        height: 250px;
        background: white;
        position: absolute;
        margin-left: -220px;
        margin-top:-125px;
        left: 50%;
        top:50%;
        border-radius: 5px;
    }
    .confirm .xconfirm .close{
        position: relative;
        right: 10px;
    }
    .confirm .xconfirm .xconfirmbox{
        width: 100%;
        height: 250px;
    }
    .confirm .xconfirm .xconfirmbox h4{
        padding-top: 60px;
        padding-bottom: 60px;
    }
</style>
