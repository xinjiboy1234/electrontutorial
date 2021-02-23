<template>
    <div class="main-layout">
        <div class="pod-layout" id="canvasContainer">
            <div class="pod-container">
                <div
                    class="detail-container"
                    :style="{
                        left: `${detailX}px`,
                        top: `${detailY}px`,
                        width: `${detailWidth}px`,
                        height: `${detailHeight}px`,
                    }"
                    id="detailmodal"
                    v-if="detailModalVisible"
                >
                    <div>
                        <div style="padding: 0px 10px">
                            <div
                                style="
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                "
                            >
                                <h1 style="margin: 10px 0px">
                                    {{ orderDataForModal.binText }}
                                </h1>
                                <el-button
                                    type="danger"
                                    size="mini"
                                    style="height: 40px"
                                    @click="hiddenSelf()"
                                >
                                    关闭
                                </el-button>
                            </div>
                            <div class="line"></div>
                            <el-table
                                :data="orderDataForModal.orderList"
                                height="240"
                                border
                                style="width: 100%"
                            >
                                <el-table-column
                                    prop="deliveryOrderNumber"
                                    label="订单号"
                                    width="240"
                                >
                                </el-table-column>
                                <el-table-column
                                    prop="quantity"
                                    label="数量"
                                    width="100"
                                >
                                </el-table-column>
                                <el-table-column
                                    prop="pickedQuantity"
                                    label="已拣数量"
                                    width="100"
                                >
                                </el-table-column>
                                <el-table-column
                                    prop="timeScope"
                                    label="经过时间"
                                    width="139"
                                >
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
                <div v-for="item in 2" :key="item">
                    <canvas
                        v-show="item === 1"
                        ref="rebinCanvas"
                        style="display: block"
                        class="canv"
                        @click="canvasClick($event)"
                    ></canvas>
                </div>
                <div
                    class="wall-command-container"
                    :style="{
                        left: `${wallCommandX}px`,
                        top: `${wallCommandY}px`,
                    }"
                    @mousedown.stop="mouseDown($event)"
                    @touchmove.stop="touchMove($event)"
                    @touchstart="touchStart($event)"
                >
                    <el-button
                        class="wall-command-button"
                        circle
                        :disabled="
                            rebinData.length < 2 && currentRebinIndex === 0
                        "
                        icon="el-icon-arrow-left"
                        @click="showPrevWall"
                    ></el-button>
                    <el-button
                        class="wall-command-button"
                        circle
                        icon="el-icon-refresh"
                        @click="refresh"
                    ></el-button>
                    <el-button
                        class="wall-command-button"
                        circle
                        icon="el-icon-close"
                        @click="closeWall"
                    ></el-button>
                    <el-button
                        class="wall-command-button"
                        circle
                        :disabled="
                            rebinData.length < 2 &&
                            currentRebinIndex === rebinData.length - 1
                        "
                        icon="el-icon-arrow-right"
                        @click="showNextWall"
                    ></el-button>
                </div>
                <div class="pod-code-container" id="detailPanel">
                    <span id="podCode" style="font-size: 64px">{{
                        wallCode
                    }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
function getTimeScope(timeStart, timeEnd) {
    let timeScopeMiliSeconds =
        new Date(timeEnd).getTime() - new Date(timeStart).getTime();
    const days = Math.floor(timeScopeMiliSeconds / (24 * 3600 * 1000));
    let remain = timeScopeMiliSeconds % (24 * 3600 * 1000);
    const hours = Math.floor(remain / (3600 * 1000));
    remain = remain % (3600 * 1000);
    const minutes = Math.floor(remain / (60 * 1000));
    // remain = remain % (60 * 1000);
    // const seconds = Math.round(remain / 1000);
    let result = "";
    if (days != 0) {
        result += `${days}天 `;
    }
    if (hours != 0) {
        result += `${hours}小时 `;
    }
    if (minutes != 0) {
        result += `${minutes}分`;
    }
    // if(seconds!=0){
    //     result+=`${seconds}秒`
    // }
    return result;
}

import rackUtil from "@/utils/rackUtil.js";
import Axios from "axios";

let rebinCanvas;

Axios.defaults.baseURL = "/api/";

export default {
    name: "RebinWall",
    mounted() {
        const rebinCanvases = this.$refs.rebinCanvas;
        // 设置canvas的宽高
        for (const item of rebinCanvases) {
            item.width = item.clientWidth;
            item.height = item.clientHeight;
        }
        this.wallCommandX = document.body.clientWidth - 450;
        this.wallCommandY = document.body.clientHeight - 120;

        this.positionData = new Map();
        Axios.get(`/rebinwall.json?id=${new Date().getTime()}`).then((resp) => {
            this.rebinData = resp.data.data;
            this.currentRebinId = this.rebinData[0].rackDTO.id;
            for (let i = 0; i < this.rebinData.length; i++) {
                this.wallCode = `${this.rebinData[i].rackDTO.code}`;
                const ctx = rebinCanvases[i].getContext("2d");
                const wallPositionData = new Map();
                this.positionData.set(this.rebinData[i].rackDTO.id, {
                    wallPositionData: wallPositionData,
                    canvasContext: ctx,
                });
                rackUtil.drawRebinRack(
                    ctx,
                    rebinCanvases[i],
                    this.rebinData[i],
                    wallPositionData
                );

                this.setOrderData(ctx, this.rebinData[i].rackDTO.id);
            }
        });
    },
    destroyed() {
        //this.isInterval = false;
    },
    data() {
        return {
            currentRebinId: 0,
            currentRebinIndex: 0,
            positionData: {},
            detailX: 0,
            detailY: 0,
            wallCommandX: 0,
            wallCommandY: 0,
            wallCommandOffsetX: 0,
            wallCommandOffsetY: 0,
            detailWidth: 600,
            detailHeight: 360,
            detailModalVisible: false,
            wallCode: "",
            rebinData: [],
            orderDataForModal: {},
            /**
             *
             */
            currentRebinWallOrderData: [],
            orderData: [],
        };
    },
    methods: {
        drawRack() {
            rackUtil.drawRack(
                this.canvasContext,
                rebinCanvas,
                this.podData,
                this.positionData
            );
        },
        /**
         * 设置订单信息
         */
        setOrderData(ctx, rebinId) {
            Axios.get(`/orderdata.json?id=${new Date().getTime()}`).then(
                (orderResp) => {
                    if (orderResp.data == null) return;
                    this.orderData = orderResp.data.data.wallOrderList;
                    const rebin = this.positionData.get(this.currentRebinId)
                        .wallPositionData;
                    // 当前分拨墙订单
                    const currentRebinOrder = orderResp.data.data.wallOrderList.find(
                        (x) => x.rackId === rebinId
                    );
                    this.currentRebinWallOrderData = currentRebinOrder;
                    currentRebinOrder.binOrderList.map((x) => {
                        if (
                            x.singleOrderList === null ||
                            x.singleOrderList.length === 0
                        ) {
                            rackUtil.reset(ctx, rebin, x.bin.id);
                        } else {
                            let orderTotalQty = 0;
                            let orderPickedTotalQty = 0;
                            x.singleOrderList.forEach((o) => {
                                orderTotalQty += o.quantity;
                                orderPickedTotalQty += o.pickedQuantity;
                            });
                            const binData = rebin.get(x.bin.id);
                            const orderData = {
                                binText: x.bin.plcCode,
                                orderTotalQty: `${orderPickedTotalQty}/${orderTotalQty}`,
                            };
                            rackUtil.drawOrderInfo(ctx, binData, orderData);
                        }
                    });
                }
            );
        },
        /**
         * 详情信息，隐藏
         */
        hiddenSelf() {
            this.detailModalVisible = false;
        },
        /**
         * canvas 点击事件，用于显示详情信息
         */
        canvasClick(e) {
            for (const rKey of this.positionData.keys()) {
                const temp = this.positionData.get(rKey).wallPositionData;
                for (const key of temp.keys()) {
                    const value = temp.get(key);
                    if (
                        e.offsetX >= value.x &&
                        e.offsetX <= value.x + value.w &&
                        e.offsetY >= value.y &&
                        e.offsetY <= value.y + value.h
                    ) {
                        // console.log(
                        //     `${value.binText} has been clicked, the bin id is ${value.storageBinId}`
                        // );
                        this.orderDataForModal = {
                            binText: value.binText,
                            orderList: [],
                        };
                        const currentRebinOrder = this.currentRebinWallOrderData.binOrderList.find(
                            (b) => b.bin.id === value.storageBinId
                        );
                        if (
                            currentRebinOrder &&
                            currentRebinOrder.singleOrderList != null
                        ) {
                            let orderTemp = currentRebinOrder.singleOrderList.map(
                                (x) => {
                                    return {
                                        deliveryOrderNumber:
                                            x.deliveryOrderNumber,
                                        timeScope:
                                            x.startDate != null
                                                ? getTimeScope(
                                                      x.startDate,
                                                      new Date()
                                                  )
                                                : "",
                                        quantity: x.quantity,
                                        pickedQuantity: x.pickedQuantity,
                                    };
                                }
                            );
                            this.orderDataForModal.orderList = orderTemp;
                        } else {
                            this.orderDataForModal.orderList = [];
                        }

                        this.detailModalVisible = true;
                        if (
                            document.body.clientWidth - 30 <
                            e.offsetX + this.detailWidth
                        ) {
                            this.detailX =
                                e.offsetX -
                                (e.offsetX +
                                    this.detailWidth -
                                    document.body.clientWidth) -
                                10;
                        } else {
                            this.detailX = e.offsetX + 30;
                        }

                        if (
                            document.body.clientHeight - 45 <
                            e.offsetY + this.detailHeight
                        ) {
                            this.detailY =
                                e.offsetY -
                                (e.offsetY +
                                    this.detailHeight -
                                    document.body.clientHeight) -
                                10;
                        } else {
                            this.detailY = e.offsetY + 45;
                        }

                        return;
                    }
                }
            }
        },
        /**
         * 工具浮层鼠标按下事件
         */
        mouseDown(e) {
            const element = e.currentTarget;
            this.wallCommandOffsetX = element.offsetLeft - this.wallCommandX;
            this.wallCommandOffsetY = element.offsetTop - this.wallCommandY;
            //算出鼠标相对元素的位置
            let disX = e.clientX - element.offsetLeft;
            let disY = e.clientY - element.offsetTop;
            document.onmousemove = (e) => {
                this.wallCommandX = e.clientX - disX;
                this.wallCommandY = e.clientY - disY;
            };

            document.onmouseup = () => {
                //鼠标弹起来的时候不再移动
                document.onmousemove = null;
                //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
                document.onmouseup = null;
            };
        },
        /**
         * 工具浮层触摸移动事件
         */
        touchMove(e) {
            // console.log(e);
            this.wallCommandX =
                e.changedTouches[0].clientX - this.wallCommandOffsetX;
            this.wallCommandY =
                e.changedTouches[0].clientY - this.wallCommandOffsetY;
        },
        /**
         * 工具浮层触摸按下事件
         */
        touchStart(e) {
            this.wallCommandOffsetX =
                e.changedTouches[0].clientX - this.wallCommandX;
            this.wallCommandOffsetY =
                e.changedTouches[0].clientY - this.wallCommandY;
        },
        /**
         * 刷新分拨墙
         */
        refresh() {
            const currentRebinPosition = this.positionData.get(
                this.currentRebinId
            );
            this.setOrderData(
                currentRebinPosition.canvasContext,
                this.currentRebinId
            );
        },
        /**
         * 前一个分拨墙
         */
        showPrevWall() {
            const currentRebinPosition = this.positionData.get(
                this.currentRebinId
            );
            this.currentRebinIndex--;
            this.currentRebinId = this.rebinData[this.currentRebinIndex].id;
            this.setOrderData(
                currentRebinPosition.canvasContext,
                this.currentRebinId
            );
            console.log("showPrevWall");
        },
        /**
         * 关闭分拨墙
         */
        closeWall() {
            console.log("closeWall");
        },
        /**
         * 下一个分拨墙
         */
        showNextWall() {
            const currentRebinPosition = this.positionData.get(
                this.currentRebinId
            );
            this.currentRebinIndex++;
            this.currentRebinId = this.rebinData[this.currentRebinIndex].id;
            this.setOrderData(
                currentRebinPosition.canvasContext,
                this.currentRebinId
            );
            console.log("showNextWall");
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@/element-variables.scss";
$height: calc(100vh - 85px);
$width: calc(100vw - 40px);
.main-layout {
    height: $height;
    width: $width;
    .pod-layout {
        .pod-container {
            border-left: 10px solid $--color-primary;
            border-right: 10px solid $--color-primary;
            height: 100%;
            .canv {
                height: calc(#{$height} - 130px);
                width: calc(#{$width} - 20px);
            }
            .wall-command-container {
                display: flex;
                width: 360px;
                position: absolute;
                background-color: #404040;
                justify-content: space-between;
                border-radius: 5px;
            }
        }
        .pod-code-container {
            border-top: 10px solid $--color-primary;
            height: 120px;
            line-height: 120px;
            text-align: center;
        }
    }
}

.wall-command-button {
    width: 60px;
    height: 60px;
    margin: 5px 15px;
}

.detail-container {
    z-index: 1000;
    background-color: white;
    border: 1px solid #f2f2f2;
    box-shadow: darkgray 3px 3px 15px 3px;
    position: absolute;
}
</style>