<template>
    <div class="timePrice">
        <PasswordModal />
        <div class="search-wrapper">
            <el-date-picker v-model="effectTime" type="date" size="mini" value-format="yyyy-MM-dd"
                :disabled="Boolean(priceBlock.length)" :placeholder="$translate('启用日期')">
            </el-date-picker>
            <el-select v-model="priceType" size="mini">
                <el-option v-for="item in priceTypes" :key="item.value" :label="$translate(item.label)"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-time-select style="width: 113px" :placeholder="$translate('开始时间')" v-model="sTime" size="mini"
                :picker-options="{
                    start: '00:00',
                    step: '01:00',
                    end: '24:00',
                    minTime: getTimeSoltLimt.startMin,
                    maxTime: getTimeSoltLimt.startMax,
                }">
            </el-time-select>
            <!-- 结束时间 -->
            <el-time-select style="width: 113px" :placeholder="$translate('结束时间')" size="mini" v-model="eTime"
                :picker-options="{
                    start: '00:00',
                    step: '01:00',
                    end: '24:00',
                    minTime: getTimeSoltLimt.endMin,
                    maxTime: getTimeSoltLimt.endMax,
                }">
            </el-time-select>
            <el-input id="priceBlock" style="width: 180px" :placeholder="$translate('电价: 元/度')" size="mini"
                v-model="price" v-on:input="inputLives">
            </el-input>
            <el-button size="mini" type="primary" @click="add"
                :disabled="Boolean(priceBlock.length) && !applyData.length">+</el-button>
            <el-button size="mini" @click="cut" :disabled="Boolean(priceBlock.length) && !applyData.length">-
            </el-button>
            <el-button size="mini" type="warning" :disabled="!priceBlock.length || !applyData.length" @click="effect">{{
                    $translate("应用")
            }}</el-button>
            <el-button size="mini" type="danger" :disabled="
                Boolean(applyData.length) ||
                (!priceBlock.length && !applyData.length)
            " @click="clear">{{ $translate("清空电价") }}</el-button>
        </div>
        <PlaneBox>
            <template #title>
                {{ $translate("时段电价") }}
                <span class="tips">
                    (
                    {{
                            $translate(
                                "请从00:00开始添加, 且满足24小时, 添加前请先清空"
                            )
                    }}
                    )
                </span>
            </template>
            <div slot="content" class="timePrice-content">
                <ul class="realTime">
                    <li v-for="(item, index) in times" :key="item">
                        <span v-if="!(index % 3)">{{ item }}</span>
                        <span v-if="index === 23">24:00</span>
                    </li>
                </ul>
                <div class="price-block">
                    <div class="tip">
                        <span class="name tip">{{ $translate("尖") }}</span>
                    </div>
                    <div class="peak">
                        <span class="name peak">{{ $translate("峰") }}</span>
                    </div>
                    <div class="flat">
                        <span class="name flat">{{ $translate("平") }}</span>
                    </div>
                    <div class="valley">
                        <span class="name valley">{{ $translate("谷") }}</span>
                    </div>
                    <el-tooltip v-for="(item, index) in priceBlock" :key="index" class="item" effect="dark"
                        :content="getContent(item)" placement="bottom-start">
                        <div :style="getStyle(item, index)">
                            {{ item.priceType }} ￥:{{ item.price }}
                        </div>
                    </el-tooltip>
                </div>
            </div>
        </PlaneBox>
    </div>
</template>

<script>
import {
    apiGetTimePrice,
    apiAddTimePrice,
    apiClearTimePrice,
} from "@/api/device";
import { priceTypes } from "@/common/config";
import { showMessage } from "@/common/utils";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: device_getters } = createNamespacedHelpers("device");
export default {
    name: "TimePrice",
    data() {
        return {
            times: [
                "00:00",
                "01:00",
                "02:00",
                "03:00",
                "04:00",
                "05:00",
                "06:00",
                "07:00",
                "08:00",
                "09:00",
                "10:00",
                "11:00",
                "12:00",
                "13:00",
                "14:00",
                "15:00",
                "16:00",
                "17:00",
                "18:00",
                "19:00",
                "20:00",
                "21:00",
                "22:00",
                "23:00",
            ],
            priceTypes,
            effectTime: "",
            priceType: "",
            sTime: "",
            eTime: "",
            price: "",
            priceBlock: [],
            applyData: [],
            marginLeftArry: [0],
            password: "",
            dialogVisible: true,
        };
    },
    mounted() {
        this.getTimePrice();
    },
    computed: {
        ...device_getters(["currentDevice","version","allDevices"]),
        getContent() {
            return ({ priceType, price, sTime, eTime }) =>
                `￥:${price} ${priceType}:${sTime}-${eTime} `;
        },
        getTimeSoltLimt() {
            let limt = {
                startMin: "",
                startMax: "",
                endMin: "",
                endMax: "",
            };
            let length = this.priceBlock.length;
            if (length) {
                let min = this.priceBlock[length - 1].eTime;
                let [hour, minute] = min.split(":");
                limt.startMin = `${+hour - 1}:${minute}`;
                limt.startMax = `${+hour + 1}:${minute}`;
                limt.endMin = min;
                limt = {
                    ...limt,
                    startMin: `${+hour - 1}:${minute}`,
                    startMax: `${+hour + 1}:${minute}`,
                    endMin: min,
                };
            } else {
                limt = {
                    ...limt,
                    startMax: "01:00",
                    endMin: "00:00",
                };
            }
            return limt;
        },
        getStyle() {
            return ({ sTime, eTime, type }) => {
                let s = +sTime.split(":")[0];
                let e = +eTime.split(":")[0];
                let width = 4.16 * (e - s);
                let marginLeft = 4.16 * s;
                return {
                    top: `${33 * (type - 1)}px`,
                    padding: "0 7px",
                    borderRadius: "3px",
                    boxSizing: "border-box",
                    width: `${width}%`,
                    marginLeft: `${marginLeft}%`,
                    background: {
                        1: "#c23531",
                        2: "#b06ceb",
                        3: "#3af3a7",
                        4: "#31e0f0",
                    }[type],
                };
            };
        },
    },
    components: {
        PlaneBox: (_) => import("@/components/PlaneBox"),
        PasswordModal: (_) => import("@/components/PasswordModal"),
    },
    methods: {
        async getTimePrice() {
            let requestData = {
                dtuId:this.version=='2'? this.allDevices[0].dtuId:this.currentDevice.id,
            };
            let { data } = await apiGetTimePrice(requestData);
            data = JSON.parse(data || "[]");
            data.forEach((item) => {
                item.sTime = item.start;
                item.eTime = item.end;
            });
            this.priceBlock = data;
        },
        add() {
            let dtuId = this.version=='2'?this.allDevices[0].dtuId:this.currentDevice.id;
            let sTime = this.sTime;
            let eTime = this.eTime;
            let priceType = this.priceType;
            let price = (+this.price).toFixed(3);
            let effectTime = this.effectTime;
            let item = {
                dtuId,
                effectTime,
                sTime,
                eTime,
                priceType,
                price,
            };
            if (Object.values(item).includes("") || Object.values(item).includes(null)) {
                return showMessage(
                    "warning",
                    this.$translate("请填写完整字段")
                );
            }
            this.applyData.push(item);
            let { label } = priceTypes.find((item) => item.value == priceType);
            this.priceBlock.push({
                sTime,
                eTime,
                type: priceType,
                priceType: label,
                price,
            });
            this.priceType = "";
            this.sTime = "";
            this.eTime = "";
            this.price = "";
        },
        cut() {
            if (this.priceBlock.length) {
                this.priceBlock.pop();
                this.applyData.pop();
            }
        },
        async effect() {
            let { sTime } = this.priceBlock[0];
            let { eTime } = this.priceBlock[this.priceBlock.length - 1];
            let s = +sTime.split(":")[0];
            let e = +eTime.split(":")[0];
            if (e - s != 24) {
                return showMessage(
                    "warning",
                    this.$translate("时段必须满足24小时")
                );
            }
            let { code } = await apiAddTimePrice(this.applyData);
            if (code === "ok") {
                showMessage("success", this.$translate("添加成功"));
                this.applyData = [];
                this.getTimePrice();
            }
        },
        clear() {
            this.$confirm(
                this.$translate("确认清空"),
                this.$translate("系统提示"),
                {
                    confirmButtonText: this.$translate("确定"),
                    cancelButtonText: this.$translate("取消"),
                    type: "warning",
                }
            ).then(async (_) => {
                let { code } = await apiClearTimePrice({
                    dtuId: this.version=='2'?this.allDevices[0].dtuId:this.currentDevice.id,
                });
                if (code === "ok") {
                    showMessage("success", this.$translate("清空成功"));
                    this.getTimePrice();
                }
            });
        },
        inputLives() {
            let dom = document.getElementById("priceBlock");
            let value = dom.value;
            value = value.replace(/[^\d\.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
            dom.value = value;
            this.price = dom.value;
        }
    },
};
</script>

<style lang="scss" scoped>
.tips {
    font-size: 10px;
}

.timePrice {
    .timePrice-content {
        padding: 30px;
        box-sizing: border-box;

        .realTime {
            display: flex;
            margin-bottom: 10px;

            li {
                flex: 1;
                height: 10px;
                position: relative;
                list-style: none;
                border-left: 1px solid #999;
                border-bottom: 1px solid #999;

                span {
                    position: absolute;
                    top: -19px;
                    font-size: 12px;
                    font-weight: bolder;
                    @include font-color("2");
                }

                &:not(:last-child) {
                    span {
                        left: -16px;
                    }
                }

                &:last-child {
                    border-right: 1px solid #999;

                    span {
                        right: -16px;
                    }
                }
            }
        }

        .price-block {
            position: relative;

            div {
                height: 32px;
                line-height: 32px;
                color: #fff;
                font-size: 10px;
                border-bottom: 1px solid #99999942;

                .name {
                    position: absolute;
                    left: -20px;
                    font-weight: bold;

                    &.tip {
                        color: #c23531;
                    }

                    &.peak {
                        color: #b06ceb;
                    }

                    &.flat {
                        color: #3af3a7;
                    }

                    &.valley {
                        color: #31e0f0;
                    }
                }
            }

            .item {
                position: absolute;
                border-bottom: none;
            }
        }
    }
}
</style>
