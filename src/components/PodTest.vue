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
                    @click="hiddenSelf()"
                >
                    <span>
                        {{ someText }}
                    </span>
                </div>
                <canvas
                    ref="podCanvas"
                    style="display: block"
                    class="canv"
                ></canvas>
                <div class="pod-code-container" id="detailPanel">
                    <span id="podCode" style="font-size: 64px">{{
                        podCode
                    }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import rackUtil from "@/utils/rackUtil.js";
import Axios from "axios";

let podCanvas;

Axios.defaults.baseURL = "/api/";

export default {
    name: "PodTest",
    mounted() {
        podCanvas = this.$refs.podCanvas;
        podCanvas.width = podCanvas.clientWidth;
        podCanvas.height = podCanvas.clientHeight;

        podCanvas.addEventListener("click", (e) => {
            for (const key of this.positionData.keys()) {
                const value = this.positionData.get(key);
                if (
                    e.offsetX >= value.x &&
                    e.offsetX <= value.x + value.w &&
                    e.offsetY >= value.y &&
                    e.offsetY <= value.y + value.h
                ) {
                    console.log(
                        `${value.binText} has been clicked, the bin id is ${value.binId}`
                    );
                    this.someText = `${value.binText} has been clicked, the bin id is ${value.binId}`;
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
        });

        this.canvasContext = podCanvas.getContext("2d");
        Axios.get(`/data.json`).then((resp) => {
            this.podData = resp.data.data;
            this.positionData = new Map();
            this.podCode = `${this.podData.rackDTO.code}${this.podData.fieldList[0].field}`;
            rackUtil.drawRack(
                this.canvasContext,
                podCanvas,
                this.podData,
                this.positionData
            );
        });
    },
    data() {
        return {
            positionData: {},
            detailX: 0,
            detailY: 0,
            detailWidth: 400,
            detailHeight: 300,
            detailModalVisible: false,
            podCode: "",
            podData: {},
            canvasContext: {},
            someText: "",
        };
    },
    methods: {
        drawRack() {
            rackUtil.drawRack(
                this.canvasContext,
                podCanvas,
                this.podData,
                this.positionData
            );
        },
        hiddenSelf() {
            this.detailModalVisible = false;
        },
    },
};
</script>

<style lang="scss">
@import "@/element-variables.scss";
$height: calc(100vh - 85px);
.main-layout {
    height: $height;
    width: 500px;
    .pod-layout {
        height: 100%;
        .pod-container {
            border-left: 10px solid $--color-primary;
            border-right: 10px solid $--color-primary;
            height: 100%;
            .canv {
                height: calc(#{$height} - 130px);
                width: 480px;
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

.detail-container {
    // width: 300px;
    // height: 200px;
    z-index: 1000;
    background-color: white;
    border: 1px solid #f2f2f2;
    box-shadow: darkgray 3px 3px 15px 3px;
    position: absolute;
}
</style>