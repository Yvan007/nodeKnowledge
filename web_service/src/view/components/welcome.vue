<template>
    <div class="welcome">
        <h3 class="superShadow">欢迎进入知识体系管理系统</h3>
    </div>
</template>

<script>

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .welcome{
        width:100%;
        height:100%;
    }

   /*body {*/
       /*font-family: 'Source Sans Pro', Arial, sans-serif;*/
       /*background: #F2F2F2;*/
       /*text-transform: uppercase;*/
       /*color: #fff;*/
       /*text-align: center;*/
       /*letter-spacing: -3px;*/
       /*padding:50px;*/
   /*}*/


   h3{
       margin-top:20%;
       font-size:80px;
       font-weight: bold;
       cursor: pointer;
   }

   /*
   text-shadow forked from: https://codepen.io/teetteet/details/dFICw#forkline
   */

   .superShadow {
       text-shadow:     0 1px 0 hsl(174,5%,80%),
       0 2px 0 hsl(174,5%,75%),
       0 3px 0 hsl(174,5%,70%),
       0 4px 0 hsl(174,5%,66%),
       0 5px 0 hsl(174,5%,64%),
       0 6px 0 hsl(174,5%,62%),
       0 7px 0 hsl(174,5%,61%),
       0 8px 0 hsl(174,5%,60%),

       0 0 5px rgba(0,0,0,.05),
       0 1px 3px rgba(0,0,0,.2),
       0 3px 5px rgba(0,0,0,.2),
       0 5px 10px rgba(0,0,0,.2),
       0 10px 10px rgba(0,0,0,.2),
       0 20px 20px rgba(0,0,0,.3);
   }
</style>
