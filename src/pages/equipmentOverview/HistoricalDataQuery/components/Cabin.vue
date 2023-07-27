<!--单个舱模块组件  -->
<template >
    <div class="cabin" >
       
        <div class="cabinHead" v-if="title">
            {{ title }}
        </div>
        <div class="cabinall" v-if="!title">
            当前运行状态
        </div>
        <div>
            <div class="celiang" v-if="title">
                遥测量
            </div>
            <div class="system-wrapper">
                <div class="custom-card-wrapper" v-for="item in data">
                    <div  :key="item.name">{{ item.name }}</div>
                    <div :key="item.val" class="val">{{ item.val }}
                    <span class="unit">{{ item.unit }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- <div>
            <div class="celiang">
                遥信量
            </div>
            <div class="msg-system-wrapper"  >
                <div class="custom-card-wrapper" v-for="item in data.pcsInfo">
                    <div  :key="item.name">{{ item.name }}</div>
                    <div :key="item.val">{{ item.val }}</div>
                </div>
            </div>
        </div> -->

</div>
</template>

<script>

export default {
    name: "",
    props: ["data"],
    data() {
        let title=this.data[0].title;
        return {
           title
        }
    },
    computed: {
        
    },
    created() {

    },
    watch: {
      
    },
    mounted() {
    },
    methods: {
        getPcsInfo(pcs){
            let i=0;
                for (const key in pcs) {
                    let obj={};
                    if (key!=="name") {
                        obj["name"]=this.dataName[i];
                        obj["val"]=pcs[key];
                        obj["unit"]=this.unit[i]
                        i++;
                        this.dataInfo.push(obj);
                    }
                }
        },
        getBmsInfo(bms){
            let i=0;
                for (const key in bms) {
                    let obj={};
                    if (key!=="name") {
                        obj["name"]=this.dataNameB[i];
                        obj["val"]=bms[key];
                        obj["unit"]=this.unitB[i]
                        i++;
                        this.dataInfo.push(obj);
                    }
                }
        }
    }
}
</script>
<style lang="scss" scoped>
/* @import url(); 引入css类 */
.cabin {
    width: 100%;
    border-radius: 10px;
    box-sizing: border-box;
    border: 1px solid #727587;
    margin-bottom: 20px;

    .cabinHead {
        padding: 10px;
        font-weight: 500;
        font-size: 18px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px 8px 0px 0px;
        background: rgb(70, 75, 100);
        color: rgb(255, 255, 255);
    }

    .celiang {
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        @include font-color("1");
        font-size: 18px;
    }

    .system-wrapper {
        border-radius: 8px;
        flex: 1;
        margin: 0 30px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-gap: 10px 30px;
        grid-auto-rows: 58px;
        color: #fff;
        margin-bottom: 20px;
        
        .custom-card-wrapper{
            background: #585c73;
            border-radius: 8px;
        }
    } 
    .msg-system-wrapper{
        border-radius: 8px;
    flex: 1;
    margin: 0 30px 30px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-gap: 10px 30px;
    grid-auto-rows: 40px;

    }
    .custom-card-wrapper{
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 4px 0px;
            cursor: pointer;
            justify-content: center;
            
        }
        .val{
            margin-top: 10px;
            font-size: 16px;
            color:rgb(13,155,255);
        }
        .unit{
            color:#fff;
            font-size: 14px;
        }
        .cabinall{
            padding: 10px;
        font-weight: 500;
        font-size: 18px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px 8px 0px 0px;
        background: rgb(70, 75, 100);
        color: rgb(255, 255, 255);
        margin-bottom: 20px;
        }
}</style>