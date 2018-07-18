/**
 * create by zhongxd 2016/07/13
 */

define(['angular','require','app','jquery','YYIMSDK','eventManager'],function(angular){
    var app = angular.module('IMApp.services',[]);

        /**
         * 用户服务
         * APP登录需要登录两次
         * 第一次登录是从后台获取到token
         * 第二次登录验证token
         */
        app.factory('userService', ['$http', 'localStorageService', 'initYYIMSDKService', function ($http, localStorageService, initYYIMSDKService) {
            return {
                /**
                 *
                 * @param data
                 * @param callback
                 */
                login: function (data, callback) {
                    if (!data) {
                        return;
                    }
                    var loginName = data.loginName;
                    var loginPwd = data.loginPassword;

                    //先获取token
                    var reqUrl = "http://172.31.12.131:8080/im/login";
                    var reqData = {
                        username: loginName,
                        userpwd: loginPwd
                    };
                    //后台解析的数据格式定义为qydata，必须这样写
                    //var qydata = {"qydata":reqData};
                    reqUrl = reqUrl + "?qydata={username:" + "'" + reqData.username + "'" + ",userpwd:" + "'" + reqData.userpwd + "'" + "}";
                    $http.post(reqUrl).success(function (data) {
                        //console.log(data);
                        if (data.result == "true") {
                            //将登录用户数据存储到localStorage
                            localStorageService.addLocalData("userInfo", data.data);
                            return callback(data);
                        } else {
                            console.log("获取token错误");
                            return callback(data);
                        }
                    }).error(function (e) {
                        console.log(e);
                    })
                },
                secondLogin: function (data) {
                    if (!data) {
                        return;
                    }
                    var userName = data.userName;
                    var userToken = data.token;
                    var dataObj = {
                        userName: userName,
                        token: userToken
                    };
                    initYYIMSDKService.init(dataObj);
                }
            }
        }])

        /**
         * 初始化YYIMSDK服务
         */
        .factory('initYYIMSDKService', ['messageService', function (messageService) {
            return {
                init: function (data) {
                    if (!data) {
                        return;
                    }
                    YYIMChat.init({
                        onOpened: function () {
                            try {
                                YYIMChat.setPresence();
                                YYIMChat.getOfflineMessage();
                                //GetGroupList();
                                //isConnectOk = true;
                                //alert("初始化成功了。。");
                            } catch (e) {
                                console.log(e);
                            }
                        }, // 登录成功
                        onClosed: function (e) {
                            console.log(e);
                            console.log("连接关闭！");
                        }, // 连接关闭
                        onAuthError: function () {
                            console.log("认证失败！");
                        }, // 认证失败
                        onStatusChanged: function (e) {
                            console.log("onStatusChanged: " + JSON.stringify(e));
                        }, // 连接状态改变
                        onConnectError: function (arg) {
                            /*console.log("连接错误！" + JSON.stringify(arg));
                             if (isConnectOk) {
                             console.log("连接错误，准备重连");
                             isConnectOk = false;
                             setTimeout("YYIMChat.connect()", 2000);
                             }*/
                        }, // 连接错误
                        onTextMessage: function (args) {
                            messageService.imTextMessageHandler(args);
                        },
                        // 接收到文本(表情)消息
                        onPictureMessage: function (arg) {
                            messageService.imPictureMessageHandler(arg);
                            console.log(JSON.stringify(arg));
                        }, // 接收到图片
                        onFileMessage: function (arg) {
                            messageService.imFileMessageHandler(arg);
                            console.log(JSON.stringify(arg));
                        }, // 接收到文件
                        onGroupUpdate: function (arg) {
                            //messageService.imTextMessageHandler(arg);
                            // GetGroupList();
                        }, // 群组信息及成员信息更新
                        onKickedOutGroup: function (arg) {
                        } // 被群组踢出


                    });
                    YYIMChat.initSDK("fanhxaa", "yonyou");

                    YYIMChat.login(
                        data.userName,
                        data.token  // 密码或token
                    );
                    // setInterval("onreconnect()", 3000);
                }
            }
        }])

        /**
         * SDK消息服务
         */
        .factory('messageService', ['eventManagerService', 'localStorageService', function (eventManagerService, localStorageService) {
            var userInfo = localStorageService.getLocalData("userInfo");
            var data = {};
            if(userInfo == null){
                data.username = "";
                data.user_principal_name = "";
            }else{
                data.username = userInfo.username || "",
                    data.user_principal_name = userInfo.user_principal_name || ""
            }
            //angularjs  ionic UI   uapmobile  imsdk
            var eventManager = eventManagerService.getInstance();
            return {

                /**
                 * 接收文本表情消息
                 * @param arg
                 */
                imTextMessageHandler: function (arg) {
                    if (!arg)
                        return;
                    try {
                        if (arg.type == "chat" && arg.data && arg.data.content
                            && (arg.data.content.indexOf("[RemoteDesktopToSender]") == 0
                            || arg.data.content.indexOf("[RemoteDesktopToReceiver]") == 0)) {
                            console.log("收到远程协助命令消息，移动端不处理");
                            return;
                        }
                        if (arg.type == "groupchat" && (data.username == arg.from.roster
                            || data.user_principal_name == arg.from.roster)) {
                            console.log("自己的群消息不处理", "imTextMessageHandler");
                            return;// 自己的群消息不处理
                        }
                        // 广播消息
                        if (arg.from == "quanyoubroadcast") {
                            console.log("广播消息", "imTextMessageHandler");
                            console.log("收到广播消息" + JSON.stringify(arg));
                            eventManager.trigger("imBroadcastMessageHandler", arg);
                            return;
                        }
                    } catch (ee) {
                        console.log(ee, "imTextMessageHandler");
                    }

                    //try {
                    //    /*if (arg.data.content.indexOf("[image]") == 0) {// 截图判定
                    //        arg.data.content = arg.data.content.substring("[image]".length);
                    //        arg.data.contentType = "8";//不要问我为啥写死成8
                    //        arg.data.content = JSON.parse(arg.data.content);*/
                    //    /*if (arg.data.content.indexOf("<img") == 0) { // 截图判定
                    //        arg.data.content =  arg.data.content.split("src");
                    //        arg.data.content = arg.data.content[1].substring(1,arg.data.content[1].length-1);
                    //        arg.data.contentType = "8";//不要问我为啥写死成8
                    //        arg.data.content = JSON.parse(arg.data.content);
                    //        var date = new Date();
                    //        var appendLatestContact = {
                    //            from: (arg.type == "groupchat") ? arg.from.room : arg.from,
                    //            type: arg.type,
                    //            text: "[图片]",
                    //            time: date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()),
                    //            grouproster: (arg.type == "groupchat") ? arg.from.roster : ""
                    //        };
                    //        //eventManager.trigger(imevent.events.cmd_AppendRecentContacts, appendLatestContact);
                    //        eventManager.trigger("imPictureMessageHandler", arg);
                    //        return;
                    //    }*/
                    //    //直接返回数据不处理，页面使用AngularJS指令ng-bind-html指令可以直接显示数据
                    //    arg.data.contentType = "8";//不要问我为啥写死成8
                    //    arg.data.content = JSON.parse(arg.data.content);
                    //    eventManager.trigger("imPictureMessageHandler", arg);
                    //    return;
                    //} catch (e) {
                    //    console.log("收到图片消息，处理出错" + e, "imTextMessageHandler");
                    //}

                    try {
                        if (arg.data.content.indexOf("[file]") == 0) {// 文件判定
                            arg.data.content = arg.data.content.substring("[image]".length);
                            arg.data.contentType = "4";//不要问我为啥写死成4
                            arg.data.content = JSON.parse(arg.data.content);
                            eventManager.trigger("imFileMessageHandler", arg);
                            return;
                        }
                    } catch (e) {
                        console.log("收到文件消息，处理出错" + e);
                    }
                    var date = new Date();
                    try {
                        var appendLatestContact = {
                            from: (arg.type == "groupchat") ? arg.from.room : arg.from,
                            type: arg.type,
                            text: (arg.type == "groupchat") ? arg.data.content : arg.data.content,
                            time: date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()),
                            grouproster: (arg.type == "groupchat") ? arg.from.roster : ""
                        };

                    } catch (e) {
                        console.log(e);
                    }
                    eventManager.trigger("imTextMessageHandler", arg);
                },
                /**
                 * 接收图片信息
                 * @param arg
                 */
                imPictureMessageHandler: function (arg) {
                    var eventManager = eventManagerService.getInstance();
                    eventManager.trigger("imPictureMessageHandler", arg);
                },
                /**
                 * 接收文件信息
                 * @param arg
                 */
                imFileMessageHandler:function(arg){
                    var eventManager = eventManagerService.getInstance();
                    eventManager.trigger("imFileMessageHandler", arg);
                },
                /**
                 * 发送文本消息
                 * @param data
                 * @constructor
                 */
                SendMessage: function (data) {
                    if (!data) {
                        return;
                    }
                    YYIMChat.sendTextMessage({
                        to: data.toid,   //用户名 imtest05
                        type: data.type, //类型chat , groupchat
                        msg: data.msg, //消息类容
                        success: function (resultdata) {
                            console.log(resultdata);
                        },
                        error: function (errorInfo) {
                            console.log("发送文本消息失败");
                            console.log(errorInfo);
                        }
                    });
                },
                /**
                 * 获取消息历史记录
                 * @param data
                 * @param  callback
                 * @constructor
                 */
                GetHistoryMessage: function (data, callback) {
                    if (!data) {
                        return;
                    }
                    YYIMChat.getHistoryMessage({
                        id: data.id,
                        chatType: data.chatType,
                        //contentType : data.contentType || 0,
                        start: data.start,
                        num: data.num,
                        success: function (resultdata) {
                            return callback(resultdata);
                        },
                        error: function (e) {
                            console.log("获取消息历史记录:" + e);
                        }
                    });
                },
                /**
                 * 获取群组列表
                 * @param callback
                 * @constructor
                 */
                GetGroupList: function (callback) {
                    YYIMChat.getChatGroups({
                        success: function (roomList) {
                            var resultdata = JSON.parse(roomList);
                            callback(resultdata);
                            //GetOfflineMessage();
                        },
                        error: function (errorInfo) {
                            console.log(errorInfo);
                        }
                    });

                },

                /**
                 * 创建群组
                 * @param data
                 * @param callback
                 * @constructor
                 */
                CreateChatGroup: function (data, callback) {
                    if (!data) {
                        return;
                    }
                    data.groupNode = Math.uuid().replace(/\-/g, "").toLowerCase().substr(0, 8);
                    YYIMChat.addChatGroup({
                        name: data.groupName,
                        node: data.groupNode,
                        success: function (resultdata) {
                            console.log(resultdata);
                            callback(resultdata);
                        },
                        complete: function () {
                            alert("sss");
                        }
                    });
                },
                /**
                 * 添加群成员
                 * @param data
                 * @param callback
                 * @constructor
                 */
                AddUserToGroup: function (data, callback) {
                    if (!data) {
                        return;
                    }
                    alert(JSON.stringify(data));
                    /*YYIMChat.addGroupMember({
                     roomId: data.id,
                     ids: data.ids,
                     success: function (resultdata) {
                     callback(resultdata);
                     //GetGroupList();
                     },
                     error: function (errorInfo) {
                     console.log(errorInfo);
                     }
                     })*/
                    YYIMChat.inviteGroupMember({
                        id:data.id,
                        to: data.id,
                        members: data.ids,
                        success: function (resultdata) {
                            callback(resultdata);
                            //GetGroupList();
                        },
                        error: function (errorInfo) {
                            console.log(errorInfo);
                        }
                    })
                },
                /**
                 * 获取群成员
                 * @param data
                 * @param callback
                 * @constructor
                 */
                GetGroupMember: function (data, callback) {
                    if (!data) {
                        return;
                    }
                    YYIMChat.getGroupMembers({
                        id: data.id, // 群的id
                        success: function (memberList) {
                            var list = JSON.parse(memberList);
                            callback(list);
                        },
                        error: function (errorInfo) {
                            console.log(errorInfo);
                            console.log("获取群成员列表错误");
                        }
                    })
                },
                /**
                 * 加入群
                 * @param data
                 * @param callback
                 * @constructor
                 */
                JoinChatGroup: function (data, callback) {
                    if (!data) {
                        return;
                    }
                    YYIMChat.joinChatGroup({
                        id: data.id, // 要加入群的id
                        success: function (resultdata) {
                            callback(resultdata);
                        },
                        error: function (errorInfo) {
                        }
                    });
                },
                /**
                 * 获取离线消息
                 * @param data
                 * @param e
                 * @constructor
                 */
                GetOfflineMessage: function () {
                    YYIMChat.getOfflineMessage();
                },
                /**
                 * 退出讨论组
                 * @param data
                 * @constructor
                 */
                ExitChatGroup: function (data, callback) {
                    YYIMChat.exitChatGroup({
                        to: data,
                        success: function (resultdata) {
                            console.log("退出群成功: " + resultdata);
                            callback(resultdata);
                        },
                        error: function (error) {
                            console.log(error);
                        }
                    });
                },
                /**
                 * 获取指定群组的共享文件列表
                 * @param data
                 */
                GetSharedFiles:function(data,callback){
                    YYIMChat.getGroupSharedFiles({
                        id: data.id,//群组id,
                        start: data.startPage, //int,
                        size: 10, //int
                        success:function(resultdata){
                            console.log("获取群文件列表成功。。。");
                            callback(resultdata);
                        },
                        error: function(error){
                            console.log(error);
                        }
                    });
                },
                /**
                 * 获取群文件下载地址
                 * @param data
                 */
                GetFileUrl:function(data){
                    if(!data){
                        return;
                    }
                    return YYIMChat.getFileUrl(data);
                },
                /**
                 * 退出系统
                 */
                LoginOut: function () {
                    YYIMChat.logout();
                }
            }
        }])

        /**
         * 本地存储
         * localStorage
         */
        .factory('localStorageService', [function () {
            return {
                addLocalData: function (key, value) {
                    try {
                        value = JSON.stringify(value);
                        localStorage.setItem(key, value);
                    } catch (e) {
                        console.log(e);
                    }
                },
                getLocalData: function (key) {
                    var stored = localStorage.getItem(key);
                    try {
                        stored = JSON.parse(stored);
                    } catch (error) {
                        stored = null;
                    }
                    return stored;
                },
                updateLocalData: function (key, value) {
                    if (key == "" || key == null) return;
                    if (value == null || key == "") return;
                    try {
                        var storedVal = localStorage.getItem(key);
                        storedVal = JSON.parse(storedVal);
                        var isHasData = false;
                        for (var i = 0; i < storedVal.length; i++) { //联系人数据存储的更新
                            if (storedVal[i].key == value.key) {
                                storedVal[i].content = value.content;
                                storedVal[i].time = value.time;
                                storedVal[i].type = value.type;
                                storedVal[i].contentype = value.contentype;
                                storedVal[i].newcount = value.newcount;
                                //storedVal[i].CName = value.CName; //di  CName 不需要更新，

                                isHasData = true;
                                break;
                            }
                        }
                        if (!isHasData) {
                            storedVal.push(value);
                        }
                        console.log(storedVal);
                        storedVal = JSON.stringify(storedVal);
                        localStorage.setItem(key, storedVal);
                    } catch (e) {
                        console.log(e);
                    }
                },
                deleteLocalData: function (key, value) {
                    try {
                        var val = localStorage.getItem(key);
                        val = JSON.parse(val);
                        for (var i = 0; i < val.length; i++) {
                            if (val[i].key ==(value.name.room || value.name)) {
                                val.splice(i, 1);
                                break;
                            }
                        }
                        console.log(val);
                        val = JSON.stringify(val);
                        localStorage.setItem(key, val);
                    } catch (e) {
                        console.log(e);
                    }
                },
                deleteLocalAllData: function (key) {
                    localStorage.removeItem(key);
                }
            };
        }])

        /**
         * 日期时间处理
         */
        .factory('dateService', [function () {
            return {
                handleMessageDate: function (messages) {
                    var i = 0,
                        length = 0,
                        messageDate = {},
                        nowDate = {},
                        weekArray = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                        diffWeekValue = 0;
                    if (messages) {
                        nowDate = this.getNowDate();
                        length = messages.length;
                        for (i = 0; i < length; i++) {
                            messageDate = this.getMessageDate(messages[i]);
                            if (!messageDate) {
                                return null;
                            }
                            if (nowDate.year - messageDate.year > 0) {
                                messages[i].lastMessage.time = messageDate.year + "";
                                continue;
                            }
                            if (nowDate.month - messageDate.month >= 0 ||
                                nowDate.day - messageDate.day > nowDate.week) {
                                messages[i].lastMessage.time = messageDate.month +
                                    "月" + messageDate.day + "日";
                                continue;
                            }
                            if (nowDate.day - messageDate.day <= nowDate.week &&
                                nowDate.day - messageDate.day > 1) {
                                diffWeekValue = nowDate.week - (nowDate.day - messageDate.day);
                                messages[i].lastMessage.time = weekArray[diffWeekValue];
                                continue;
                            }
                            if (nowDate.day - messageDate.day === 1) {
                                messages[i].lastMessage.time = "昨天";
                                continue;
                            }
                            if (nowDate.day - messageDate.day === 0) {
                                messages[i].lastMessage.time = messageDate.hour + ":" + messageDate.minute;
                                continue;
                            }
                        }
                        // console.log(messages);
                        // return messages;
                    } else {
                        console.log("messages is null");
                        return null;
                    }

                },
                getNowDate: function () {
                    var nowDate = {};
                    var date = new Date();
                    nowDate.year = date.getFullYear();
                    nowDate.month = date.getMonth();
                    nowDate.day = date.getDate();
                    nowDate.week = date.getDay();
                    nowDate.hour = date.getHours();
                    nowDate.minute = date.getMinutes();
                    nowDate.second = date.getSeconds();
                    return nowDate;
                },
                getMessageDate: function (message) {
                    var messageDate = {};
                    var messageTime = "";
                    //2015-10-12 15:34:55
                    var reg = /(^\d{4})-(\d{1,2})-(\d{1,2})\s(\d{1,2}):(\d{1,2}):(\d{1,2})/g;
                    var result = new Array();
                    if (message) {
                        messageTime = message.lastMessage.originalTime;
                        result = reg.exec(messageTime);
                        if (!result) {
                            console.log("result is null");
                            return null;
                        }
                        messageDate.year = parseInt(result[1]);
                        messageDate.month = parseInt(result[2]);
                        messageDate.day = parseInt(result[3]);
                        messageDate.hour = parseInt(result[4]);
                        messageDate.minute = parseInt(result[5]);
                        messageDate.second = parseInt(result[6]);
                        // console.log(messageDate);
                        return messageDate;
                    } else {
                        console.log("message is null");
                        return null;
                    }
                }
            };
        }])

        /**
         * background interface
         * 后台接口服务
         */
        .factory('bgIfService', function ($http) {
            var hostPort = "http://172.31.12.131:8080/im";
            return {
                getNotifyList: function (data, callback) {
                    if (!data) {
                        return;
                    }
                    var page = data.page;
                    var rows = data.rows;
                    var reqUrl = hostPort + "/getSendSuccessMassMsg?page=" + page + "&rows=" + rows;
                    $http.post(reqUrl).success(function (data) {
                        if (data.result == "true") {
                            return callback(data);
                        } else {
                            console.log("获取通知列表错误");
                            return callback(data);
                        }
                    }).error(function (e) {
                        console.log(e);
                    })
                },
                /**
                 * 获取文件两种情况
                 * 1.如果群文件的话
                 * data.sender = username;//imtest01 登录人的账号
                 * data.receiver = receiver;//群id
                 * 2.如果是用户与用户之间的文件
                 * data.sender = username;//imtest01 登录人的账号
                 * data.receiver = receiver;//对方的账号 imtest02
                 * @param data
                 * @param callback
                 */
                getGroupFileList: function (data, callback) {
                    var reqUrl = hostPort + "/getAllSendFileRecord?receiver=" + data.receiver;
                    $http.post(reqUrl).success(function (data) {
                        if (data.result == "true") {
                            return callback(data);
                        } else {
                            console.log("获取群文件列表错误");
                            return callback(data);
                        }
                    }).error(function (e) {
                        console.log(e);
                    })
                }
            }
        })

        /**
         * 事件监听
         */
        .factory('eventManagerService', function () {
            return {
                getInstance: function () {
                    try {
                        if (!EventManager._instance) {
                            EventManager._instance = new EventManager();
                            if (EventManager._instance && EventManager._instance._init && typeof EventManager._instance._init == "function") {
                                EventManager._instance._init();
                            }
                        }
                        return EventManager._instance;
                    } catch (err) {
                        console.log("获取存储自定义的全局事件监听器对象:" + err);
                        return EventManager._instance;
                    }
                },
                EventListener: function (subject, callback) {
                    try {
                        /**
                         * @description {string} 所订阅的主题，即全局事件的名称
                         * @field
                         */
                        this.subject = subject;

                        /**
                         * @description {method} 执行的函数
                         * @field
                         */
                        this.callback = callback || function (event, data) {
                                console.log("默认的事件Callback:" + event);
                            };
                    } catch (err) {
                        console.log("全局事件监听对象构造函数出错:" + err);
                    }
                },
                EventManager: function () {
                    try {
                        /**
                         * @description {Object} 存储自定义的全局事件监听器，结构为{name1:[listener1,listener2],name2:[listener3]...}
                         * @field
                         */
                        this.events = new Object();
                    } catch (err) {
                        console.log("存储自定义的全局事件监听器:" + err);
                    }
                },
                trigger: function (subject, data) {
                    try {
                        console.log("触发监听事件: " + subject);

                        // 触发同步监听事件
                        if (this.events[subject] && this.events[subject] instanceof Array) {
                            var eventList = this.events[subject];
                            for (var i = 0; i < eventList.length; i++) {
                                var listener = eventList[i];
                                try {
                                    //logger.write("触发监听事件: " + data); 大数据写入卡;
                                    listener.callback(subject, data);
                                } catch (e) {
                                    console.log("触发监听事件异常" + subject + " :exception:" + e);
                                    break;
                                }
                            }
                        }
                    } catch (err) {
                        console.log("触发监听事件错误: " + err);
                    }
                },
                triggerAsync: function () {
                    try {
                        console.log("异步触发监听事件: " + subject);
                        setImmediate(function () {
                            this.trigger(subject, data);
                        }, 13);
                    } catch (err) {
                        console.log("异步触发监听事件错误: " + err);
                    }
                },
                registerEventHandler: function (subject, callback) {
                    try {
                        if (!this.events[subject]) {
                            this.events[subject] = new Array();
                        }
                        this.events[subject].push(new EventListener(subject, callback));
                    } catch (err) {
                        console.log("注册全局事件监听函数错误: " + err);
                    }
                }
            }
        })

        /**
         * webSQL数据服务
         */
        .factory('DBService', function () {
            var db = openDatabase("mydb2", '1.0', 'mydb2', 1000000 * 1024);
            return {
                createDB: function () {
                    var Name = "imtest03";
                    var Content = "sdfkls";
                    var xiaoping = "120301";
                    db.transaction(function (tx) {
                        tx.executeSql("CREATE TABLE IF NOT EXISTS CHATMSG(Ts unique,Name ,Content ,xiaoping )");
                        //tx.executeSql("CREATE TABLE IF NOT EXISTS DOWNMAP(PATH unique,LOCALPATH,TYPE,SUFF,SIZE,CDATE)");//下载地址，本地地址，类型(image,file),后缀名,大小,创建时间
                        /*var sql = "select * from CHATMSG";
                         tx.executeSql(sql,function(xp){
                         console.log(xp);
                         });*/
                    });
                },
                insertData: function (data) {
                    //var  Id = data.id;
                    /*var Name = data.name;
                     var Content = data.content;
                     var Date = data.date;*/
                    db.transaction(function (tx) {
                        tx.executeSql("INSERT INTO CHATMSG (Ts,Name,Content,xiaoping) values(?, ?, ?, ?)", ['ww', 'XIAOPING', '小东', 'xiaop'], null, null);
                    });

                },
                selectData: function (data) {
                    var Name = data.name;
                    db.executeSql("select * from CHATMSG where Name='" + Name + "'");
                },
                deleteData: function (data) {
                    var Name = data.name;
                    db.executeSql("delete from CHATMSG where Name='" + Name + "'");
                },
                updateData: function (data) {
                    var Name = data.name;
                    db.executeSql("select Content from CHATMSG where Name='" + Name + "' order by Date limit 1");
                }
            }
        })



        /**
         * 表情转换服务
         */
        .factory('faceService', function () {
            var folder = "img/face";
            var data = [{actionKey: "[:愉快]", reg: /\[\:愉快\]/g, url: "smile_1f60a.png"},
                {actionKey: "[:调皮]", reg: /\[\:调皮\]/g, url: "smile_1f60b.png"},
                {actionKey: "[:傲娇]", reg: /\[\:傲娇\]/g, url: "smile_1f60c.png"},
                {actionKey: "[:色]", reg: /\[\:色\]/g, url: "smile_1f60d.png"},
                {actionKey: "[:酷]", reg: /\[\:酷\]/g, url: "smile_1f60e.png"},
                {actionKey: "[:阴险]", reg: /\[\:阴险\]/g, url: "smile_1f60f.png"},
                {actionKey: "[:亲吻]", reg: /\[\:亲吻\]/g, url: "smile_1f61a.png"},
                {actionKey: "[:吐舌]", reg: /\[\:吐舌\]/g, url: "smile_1f61b.png"},
                {actionKey: "[:鬼脸]", reg: /\[\:鬼脸\]/g, url: "smile_1f61c.png"},
                {actionKey: "[:淘气]", reg: /\[\:淘气\]/g, url: "smile_1f61d.png"},
                {actionKey: "[:难过]", reg: /\[\:难过\]/g, url: "smile_1f61e.png"},
                {actionKey: "[:囧]", reg: /\[\:囧\]/g, url: "smile_1f61f.png"},
                {actionKey: "[:叹气]", reg: /\[\:叹气\]/g, url: "smile_1f62a.png"},
                {actionKey: "[:抓狂]", reg: /\[\:抓狂\]/g, url: "smile_1f62b.png"},
                {actionKey: "[:呵呵]", reg: /\[\:呵呵\]/g, url: "smile_1f62c.png"},
                {actionKey: "[:大哭]", reg: /\[\:大哭\]/g, url: "smile_1f62d.png"},
                {actionKey: "[:惊讶]", reg: /\[\:惊讶\]/g, url: "smile_1f62e.png"},
                {actionKey: "[:诧异]", reg: /\[\:诧异\]/g, url: "smile_1f62f.png"},
                {actionKey: "[:哈哈]", reg: /\[\:哈哈\]/g, url: "smile_1f600.png"},
                {actionKey: "[:嘻嘻]", reg: /\[\:嘻嘻\]/g, url: "smile_1f601.png"},
                {actionKey: "[:笑哭]", reg: /\[\:笑哭\]/g, url: "smile_1f602.png"},
                {actionKey: "[:高兴]", reg: /\[\:高兴\]/g, url: "smile_1f603.png"},
                {actionKey: "[:开心]", reg: /\[\:开心\]/g, url: "smile_1f604.png"},
                {actionKey: "[:汗]", reg: /\[\:汗\]/g, url: "smile_1f605.png"},
                {actionKey: "[:大笑]", reg: /\[\:大笑\]/g, url: "smile_1f606.png"},
                {actionKey: "[:天使]", reg: /\[\:天使\]/g, url: "smile_1f607.png"},
                {actionKey: "[:恶魔]", reg: /\[\:恶魔\]/g, url: "smile_1f608.png"},
                {actionKey: "[:眨眼]", reg: /\[\:眨眼\]/g, url: "smile_1f609.png"},
                {actionKey: "[:抿嘴]", reg: /\[\:抿嘴\]/g, url: "smile_1f610.png"},
                {actionKey: "[:无视]", reg: /\[\:无视\]/g, url: "smile_1f611.png"},
                {actionKey: "[:鄙视]", reg: /\[\:鄙视\]/g, url: "smile_1f612.png"},
                {actionKey: "[:无语]", reg: /\[\:无语\]/g, url: "smile_1f613.png"},
                {actionKey: "[:无奈]", reg: /\[\:无奈\]/g, url: "smile_1f614.png"},
                {actionKey: "[:撅嘴]", reg: /\[\:撅嘴\]/g, url: "smile_1f615.png"},
                {actionKey: "[:难受]", reg: /\[\:难受\]/g, url: "smile_1f616.png"},
                {actionKey: "[:亲]", reg: /\[\:亲\]/g, url: "smile_1f617.png"},
                {actionKey: "[:爱]", reg: /\[\:爱\]/g, url: "smile_1f618.png"},
                {actionKey: "[:亲亲]", reg: /\[\:亲亲\]/g, url: "smile_1f619.png"},
                {actionKey: "[:愤怒]", reg: /\[\:愤怒\]/g, url: "smile_1f620.png"},
                {actionKey: "[:狂怒]", reg: /\[\:狂怒\]/g, url: "smile_1f621.png"},
                {actionKey: "[:委屈]", reg: /\[\:委屈\]/g, url: "smile_1f622.png"},
                {actionKey: "[:痛苦]", reg: /\[\:痛苦\]/g, url: "smile_1f623.png"},
                {actionKey: "[:怒气]", reg: /\[\:怒气\]/g, url: "smile_1f624.png"},
                {actionKey: "[:心塞]", reg: /\[\:心塞\]/g, url: "smile_1f625.png"},
                {actionKey: "[:不开心]", reg: /\[\:不开心\]/g, url: "smile_1f626.png"},
                {actionKey: "[:郁闷]", reg: /\[\:郁闷\]/g, url: "smile_1f627.png"},
                {actionKey: "[:生病]", reg: /\[\:生病\]/g, url: "smile_1f628.png"},
                {actionKey: "[:伤心]", reg: /\[\:伤心\]/g, url: "smile_1f629.png"},
                {actionKey: "[:重病]", reg: /\[\:重病\]/g, url: "smile_1f630.png"},
                {actionKey: "[:惊恐]", reg: /\[\:惊恐\]/g, url: "smile_1f631.png"},
                {actionKey: "[:晕]", reg: /\[\:晕\]/g, url: "smile_1f632.png"},
                {actionKey: "[:尴尬]", reg: /\[\:尴尬\]/g, url: "smile_1f633.png"},
                {actionKey: "[:睡觉]", reg: /\[\:睡觉\]/g, url: "smile_1f634.png"},
                {actionKey: "[:晕菜]", reg: /\[\:晕菜\]/g, url: "smile_1f635.png"},
                {actionKey: "[:萌]", reg: /\[\:萌\]/g, url: "smile_1f636.png"},
                {actionKey: "[:害羞]", reg: /\[\:害羞\]/g, url: "smile_263a.png"}
            ];
            return {
                strCorventToFace: function (str) {
                    //对字符串进行特殊标签处理
                    str=str.replace(/</g,'&lt');
                    str=str.replace(/>/g,'&gt');
                    data.forEach(function (ele) {
                        var reg = new RegExp(ele.reg);
                        str = str.replace(reg, ('<img src="' + folder + '/' + ele.url + '" alt="" width="27" height="27" align="absmiddle">'));
                    });
                    return str;
                },
                faceMapping: function () {
                    var dd = JSON.parse(JSON.stringify(data));
                    dd.forEach(function (ele) {
                        ele.url = folder + '/' + ele.url;
                    });
                    return dd;
                }
            }
        });

    return app;

});










