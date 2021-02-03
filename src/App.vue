<template>
    <el-container>
        <!-- 窗体功能区域 -->
        <el-header>
            <el-row :gutter="0">
                <el-col :span="20">
                    <div>
                        <el-button icon="el-icon-search" circle></el-button>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="window-command-btn-zone">
                        <el-button
                            class="window-command-btn"
                            icon="el-icon-minus"
                            size="mini"
                            @click="minWindow"
                        ></el-button>
                        <el-button
                            class="window-command-btn"
                            size="mini"
                            @click="maxWindow"
                        >
                            <div v-if="isMaxWindow">
                                <svg
                                    t="1612266103867"
                                    class="icon"
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="2065"
                                    width="12"
                                    height="12"
                                >
                                    <path
                                        d="M959.72 0H294.216a63.96 63.96 0 0 0-63.96 63.96v127.92H64.28A63.96 63.96 0 0 0 0.32 255.84V959.4a63.96 63.96 0 0 0 63.96 63.96h703.56a63.96 63.96 0 0 0 63.96-63.96V792.465h127.92a63.96 63.96 0 0 0 63.96-63.96V63.96A63.96 63.96 0 0 0 959.72 0zM767.84 728.505V959.4H64.28V255.84h703.56z m189.322 0H831.8V255.84a63.96 63.96 0 0 0-63.96-63.96H294.216V63.96H959.72z"
                                        p-id="2066"
                                        fill="#FFFFFF"
                                    ></path>
                                </svg>
                            </div>
                            <div v-else>
                                <svg
                                    t="1612266576735"
                                    class="icon"
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="2735"
                                    width="12"
                                    height="12"
                                >
                                    <path
                                        d="M865.28 939.52H158.72c-40.96 0-74.24-33.28-74.24-74.24V158.72c0-40.96 33.28-74.24 74.24-74.24h706.56c40.96 0 74.24 33.28 74.24 74.24v706.56c0 40.96-33.28 74.24-74.24 74.24zM158.72 151.04c-4.096 0-7.68 3.584-7.68 7.68v706.56c0 4.096 3.584 7.68 7.68 7.68h706.56c4.096 0 7.68-3.584 7.68-7.68V158.72c0-4.096-3.584-7.68-7.68-7.68H158.72z"
                                        p-id="2736"
                                        fill="#ffffff"
                                    ></path>
                                </svg>
                            </div>
                        </el-button>

                        <el-button
                            class="window-command-btn"
                            icon="el-icon-close"
                            size="mini"
                            @click="closeWindow"
                        ></el-button>
                    </div>
                </el-col>
            </el-row>
        </el-header>
        <!-- 窗体内容区域 -->
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script>
const ipcRenderer = window.require("electron").ipcRenderer;

function getParent(node) {
    if (node.nodeName == "BUTTON") {
        return node;
    } else {
        return getParent(node.parentNode);
    }
}

export default {
    name: "App",
    props: {},
    data() {
        return {
            isMaxWindow: false,
        };
    },
    components: {},
    mounted() {
        ipcRenderer.on("window-restore", function () {
            this.isMaxWindow = false;
        });

        ipcRenderer.on("window-max", function () {
            this.isMaxWindow = true;
        });
    },
    methods: {
        closeWindow() {
            ipcRenderer.send("window-close");
        },
        minWindow(e) {
            blur(e);
            ipcRenderer.send("window-min");
        },
        maxWindow(e) {
            let target = getParent(e.target);
            target.blur();
            this.isMaxWindow = !this.isMaxWindow;
            ipcRenderer.send("window-max");
        },
    },
};
</script>

<style lang='scss'>
@import "@/element-variables.scss";
$command-hover-background: coral;
$command-hover-color: white;

.el-header {
    height: 40px !important;
    min-width: 800px;
    padding: 0px !important;
    background-color: $--color-primary;
    -webkit-app-region: drag;
    .window-command-btn-zone {
        float: right;
    }
    .window-command-btn {
        margin: 0px;
        border: 0px;
        height: 40px;
        width: 45px;
        color: white;
        font-weight: bold;
        background-color: $--color-primary;
        vertical-align: middle;
        border-radius: 0px;
        -webkit-app-region: no-drag !important;
        &:hover {
            background-color: $command-hover-background;
            color: $command-hover-color;
        }
        &:focus {
            background-color: $--color-primary;
            color: $command-hover-color;
        }
    }
}
</style>
