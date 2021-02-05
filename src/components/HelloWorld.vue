<template>
	<div class="hello">
		<div>
			<h1>Light Test</h1>
			<el-button @click="connectToServer" type="primary" plain>Conn</el-button>
			<el-button @click="batchLightOn" type="primary" plain>Light On</el-button>
			<el-button @click="batchLightOff" type="primary" plain>Light Off</el-button>
		</div>

		<div class="container">
			<el-row type="flex" :gutter="10">
				<el-col :span="8">
					<div class="basic-container settings-container">
						<div>
							<h3>Host Settings</h3>
							<div>
							<el-button type="primary" @click="hostDialogVisible=true">Add</el-button>
							<el-button type="danger" :disabled="hosts.length<=0 && selectedHosts.length>0" @click="hostSettingsDelete">Delete</el-button>
							</div>
							<el-table :data="hosts" class="host-table" @selection-change="hostSelectionChanged">
                                <el-table-column type="selection" width="55">
								</el-table-column>
                                <el-table-column prop="ip" label="IP">
                                </el-table-column>
                                <el-table-column prop="port" label="Port">
                                </el-table-column>
							</el-table>
						</div>
						<div>
							<div>
								<h3>Light Settings</h3>
							</div>
							<div>
								<el-button type="primary" @click="lightSettingDialogVisible = true">Add</el-button>
								<el-button type="danger" :disabled="lights.length<=0&&selectedLights.length>0" @click="lightSettingsDelete">Delete</el-button>
							</div>
							<el-table :data="lights" class="light-table" @selection-change="lightsSelectionChanged">
								<el-table-column type="selection" width="55">
								</el-table-column>
								<el-table-column prop="index" label="Index">
								</el-table-column>
								<el-table-column prop="displayNumber" label="DisplayNumber">
								</el-table-column>
								<el-table-column prop="color" label="Color">
									<template slot-scope="scope">
									<font :color="scope.row.color == 'WHITE'? gray: scope.row.color" fontweight="bold">
										<strong>{{scope.row.color}}</strong>
									</font>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
				</el-col>
				<el-col :span="16">
                    <div class="receivebox-container">
                        <el-input id="receivedMessage" type="textarea" placeholder="Received Message" v-model="message" readonly="true">
                    </div>
				</el-col>
			</el-row>
		</div>
		<!-- 服务器配置 -->
		<el-dialog :visible.sync="hostDialogVisible">
			<el-form :model="host">
				<el-form-item label="Ip" :label-width="formLabelWidth">
					<el-input v-model="host.ip" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="Port" :label-width="formLabelWidth">
					<el-input v-model="host.port" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="hostSettingCancel">Close</el-button>
				<el-button type="primary" @click="hostSettingConfirm">Save</el-button>
			</div>
		</el-dialog>
		<!-- 灯设置 -->
		<el-dialog :visible.sync="lightSettingDialogVisible">
			<el-form :model="light">
				<el-form-item label="Index" :label-width="formLabelWidth2">
					<el-input v-model="light.index" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="Display Number" :label-width="formLabelWidth2">
					<el-input v-model="light.displayNumber" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="Color" :label-width="formLabelWidth2">
					<el-select v-model="light.color">
                        <el-option label="RED" value="RED"></el-option>
                        <el-option label="WHITE" value="WHITE"></el-option>
                        <el-option label="YELLOW" value="YELLOW"></el-option>
                        <el-option label="BLUE" value="BLUE"></el-option>
                        <el-option label="GREEN" value="GREEN"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="lightSettingCancel">Close</el-button>
				<el-button type="primary" @click="lightSettingsSave">Save</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
// import socketClient from "@/utils/socket";
const ipcRenderer = window.require("electron").ipcRenderer;

export default {
    name: "HelloWorld",
    data() {
        return {
            message: "",
            options: [
                {
                    label: "Red",
                    value: "red",
                },
            ],
            value: "",
            hosts: [],
            lights: [],
            host: {
                ip: "",
                port: "",
            },
            hostDialogVisible: false,
            formLabelWidth: "100px",
            formLabelWidth2: "130px",
            lightSettingDialogVisible: false,
            light: {
                index: "",
                displayNumber: "",
                color: "",
            },
            selectedLights: [],
            selectedHosts: [],
        };
    },

    mounted() {
        /**
         * 服务端返回数据回调注册
         */
        // ipcRenderer.on("receiveCallback", (data) => {
        //     const date = new Date();
        //     this.message +=
        //         date.toLocaleString() +
        //         "\nReceived Data from Server" +
        //         JSON.stringify(data) +
        //         "\n";
        // });
        ipcRenderer.on("receiveCallback", (data) => {
            const date = new Date();
            this.message +=
                date.toLocaleString() +
                "\nReceived Data from Server" +
                JSON.stringify(data) +
                "\n";
        });
    },

    methods: {
        /**
         * 添加主机窗口关闭
         */
        hostSettingCancel() {
            this.hostDialogVisible = false;
        },
        /**
         * 添加主机信息
         */
        hostSettingConfirm() {
            const re = /^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/;

            if (!re.test(this.host.ip)) {
                this.$message({
                    message: "Invalid IP Address",
                    type: "warning",
                });
                return;
            }

            const rePort = /[^\d]/g;
            if (rePort.test(this.host.port)) {
                this.$message({
                    message: "Invalid PortNumber",
                    type: "warning",
                });
                return;
            }

            const h = this.hosts.find(
                (x) => x.ip === this.host.ip && x.port === this.host.port
            );
            if (h === null || h === undefined) {
                this.hosts.push({
                    ip: this.host.ip,
                    port: this.host.port,
                    isConnected: false,
                });
            } else {
                this.$message({
                    message: "The host already exists",
                    type: "warning",
                });
                return;
            }
            this.hostDialogVisible = false;
            this.host = {
                ip: "",
                port: "",
            };
        },

        /**
         * 删除选中的主机
         */
        hostSettingsDelete() {
            if (this.selectedHosts.length === 0) {
                this.$message({
                    message: "Please select one record",
                    type: "warning",
                });
                return;
            }
            this.selectedHosts.forEach((x) => {
                for (let i = 0; i < this.hosts.length; i++) {
                    if (x.index === this.hosts[i].index) {
                        // 断开连接
                        ipcRenderer.send(
                            "disConnect",
                            this.hosts[i].ip,
                            this.hosts[i].port
                        );
                        // socketClient.disConnect(
                        //     this.hosts[i].ip,
                        //     this.hosts[i].port
                        // );
                        this.hosts.splice(i, 1);
                    }
                }
            });
        },
        /**
         * 表格多选框事件
         */
        lightsSelectionChanged(val) {
            this.selectedLights = val;
        },

        hostSelectionChanged(val) {
            this.selectedHosts = val;
        },
        /**
         * 添加灯数据
         */
        lightSettingsSave() {
            const regxlight = /[^\d]/g;
            if (regxlight.test(this.light.index)) {
                this.$message({
                    message: "Invalid PortNumber",
                    type: "warning",
                });
                return;
            }

            const l = this.lights.find((x) => x.index === this.light.index);
            if (l === null || l === undefined) {
                this.lights.push({
                    index: this.light.index,
                    displayNumber: this.light.displayNumber,
                    color: this.light.color,
                });
            } else {
                this.$message({
                    message: "The light already exists",
                    type: "warning",
                });
                return;
            }
            this.lightSettingDialogVisible = false;
            this.light = {
                index: "",
                displayNumber: "",
                color: "",
            };
        },
        /**
         * 添加窗口关闭
         */
        lightSettingCancel() {
            this.lightSettingDialogVisible = false;
        },
        /**
         * 删除选定的灯
         */
        lightSettingsDelete() {
            if (this.selectedLights.length === 0) {
                this.$message({
                    message: "Please select one record",
                    type: "warning",
                });
                return;
            }
            this.selectedLights.forEach((x) => {
                for (let i = 0; i < this.lights.length; i++) {
                    if (x.index === this.lights[i].index) {
                        this.lights.splice(i, 1);
                    }
                }
            });
        },
        /**
         * 连接到服务器
         */
        connectToServer() {
            /*
      6D0006000000510c000d001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100
      */
            // this.hosts.map((h) => {
            //     socketClient.connect(h.ip, h.port, (data) => {
            //         const date = new Date();
            //         this.message +=
            //             date.toLocaleString() +
            //             "\n接收到服务器数据" +
            //             JSON.stringify(data) +
            //             "\n";
            //     });
            // });
            this.hosts.map((h) => {
                ipcRenderer.send("connect", h.ip, h.port);
            });
        },

        batchLightOn() {
            this.hosts.map((h) => {
                let lampArr = [];
                this.lights.map((l) => {
                    const lamp = {
                        id: l.index,
                        qty: l.displayNumber,
                    };
                    lampArr.push(lamp);
                });
                if (lampArr.length <= 0) return;
                ipcRenderer.send("batchLightOn", {
                    ip: h.ip,
                    port: h.port,
                    color: "red",
                    lamps: lampArr,
                });
                // socketClient.batchLightOn({
                //     ip: h.ip,
                //     port: h.port,
                //     color: "red",
                //     lamps: lampArr,
                // });
            });
        },
        /**
         * 批量灭灯
         */
        batchLightOff() {
            this.hosts.map((h) => {
                ipcRenderer.send("batchLightOff", {
                    ip: h.ip,
                    port: h.port,
                    color: "",
                    lamps: [],
                });
                // socketClient.batchLightOff({
                //     ip: h.ip,
                //     port: h.port,
                //     color: "",
                //     lamps: [],
                // });
            });
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
.container {
    margin-top: 10px;
    .basic-container {
        padding: 10px;
        border: #dcdfe6 solid 1px;
        border-radius: 5px;
    }
    .light-table {
        margin-top: 10px;
    }
    .host-table {
        margin-top: 10px;
    }
}
#receivedMessage {
    min-height: 500px !important;
}
</style>
