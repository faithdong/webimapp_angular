/**
 * Created by zhongxd on 2016/8/5.
 * 单聊
 */

define([],function () {
    'use strict';
    function singleChatCtrl($scope, $stateParams, $ionicScrollDelegate,$state,
                            $rootScope,faceService, eventManagerService, localStorageService) {

        var msg ;
        //创建监听事件
        var eventManager = eventManagerService.getInstance();
        var userInfoName=localStorageService.getLocalData('userInfo').username;
        //用于判断是否显示表情面板
        $scope.isShowExpressionPanel = false;

        //定义滚动视图，scrollToBottom，scrollToTop方法时触发，由框架帮忙计算滚动位置
        $ionicScrollDelegate.$getByHandle('messageDetailsScroll');

        //加载页面的时候做的处理,得到当前聊天对象的信息;从本地获取聊天记录
        $scope.chatTo = $stateParams.messageId;

        var newsData = localStorageService.getLocalData(userInfoName+'unread' + $scope.chatTo);
        $scope.messageDetils = newsData || [];

        /**
         * 滚动到最下面
         */
        $scope.scrollToBottom = function () {
            $ionicScrollDelegate.scrollBottom([true]);
        };

        /**
         * 返回顶部
         */
        $scope.scrollToTop = function () {
            $ionicScrollDelegate.scrollTop([true]);
        };

        /**
         * 发送消息
         */
        $scope.sendMessage = function () {
            //添加一个触发事件接口，让聊天页面监听org 需要传递的参数
            var arg = {
                from: $scope.chatTo,
                data: {
                    content: $scope.send_content,
                    contentType: '', //暂时用不到
                    dateline: new Date().getTime()
                }, // "[:]"中内容为表情
                type: "chat" // 群消息则为"groupchat"
            };
            eventManager.trigger("imSendMessage", arg);

            var msgContent = faceService.strCorventToFace($scope.send_content);
            var msg = {isFromeMe: true, content: msgContent};
            $scope.messageDetils.push(msg);
            $scope.msgContent = msgContent;
            $scope.scrollToBottom();

            YYIMChat.sendTextMessage({
                to: $scope.chatTo,
                msg: $scope.send_content, // "[:]"中内容为表情
                type: "chat", // 群消息则为"groupchat"
                success: function () {
                },
                error: function (errorInfo) {
                }
            });
            $scope.send_content = '';
        };

        /**
         * 发送图片
         * 需要调用UAPMobile的API访问相册
         */
        $scope.sendPic = function(){
            /* var dataObj = {
             fileInputId:'picture', //文本域id
             to:$scope.chatTo,//对话人id
             type:'chat'
             };*/
            /*eventManager.registerEventHandler("photoAlbumCallback",function(event,data){
             //获取到图片路径
             var imgUrl = data;
             $scope.pic = imgUrl;
             alert("执行到监听");
             YYIMChat.sendPic({
             fileInputId:'picture', //文本域id
             to:$scope.chatTo,//对话人id
             type:'chat',
             success:function(res){
             alert("IM回调");
             console.log(res);
             }
             });
             });*/
            $camera.openPhotoAlbum ({
                bindfield : "picimg",
                callback:"photoAlbumCallback()"
            });
        };

        /**
         * 接收消息
         * 文本表情
         */
        eventManager.registerEventHandler('imTextMessageHandler', function (event, data) {

            /*
             * 分离群消息和个人消息，将个人消息存在personalMessage数组里面
             * receiveMsgType 用来判断收到消息的类型 1为文本，2为图片，3为文件
             * */

            if (data.type == 'chat' && data.from == $scope.chatTo) {
                var msg = faceService.strCorventToFace(data.data.content);
                var message = {
                    'isFromeMe': false,'receiveMsgType':1,
                    'name': data.from, 'content': msg, 'type': data.chat,
                    'contentType': data.data.contentType, 'time': data.data.dateline
                };
                $scope.messageDetils.push(message);
            }
            $scope.$apply();  //手动刷新$scope页面
            $scope.scrollToBottom();  //滚动页面到最底部

        });

        /**
         * 接收图片信息
         */
        eventManager.registerEventHandler('imPictureMessageHandler',function(event,data){
            if(!data || !data.data) return;

            if (data.type == 'chat' && data.from == $scope.chatTo) {
                msg=typeof(data.data.content) == "object" ? '<img src="'+data.data.content.path+'" alt="">' : data.data.content;
                //定义数组方便html页面绑定取值
                var message = {
                    'isFromeMe': false, 'receiveMsgType': 2,
                    'name': data.from, 'content': msg, 'type': data.chat,
                    'contentType': data.data.contentType, 'time': data.data.dateline
                };
                $scope.messageDetils.push(message);
                $scope.$apply();  //手动刷新$scope页面
                $scope.scrollToBottom();  //滚动页面到最底部
            }
        });

        /**
         * 接收文件信息
         */
        eventManager.registerEventHandler("imFileMessageHandler",function(event,data){
            console.log(data);
            var msg = data.data.content;
            //msg.url = msg.path;
            //定义数组方便html页面绑定取值
            var msgAry= [];
            msgAry.push(msg);
            var message = {
                'isFromeMe': false,'receiveMsgType':3,
                'name': data.from, 'content': msgAry, 'type': data.chat,
                'contentType': data.data.contentType, 'time': data.data.dateline
            };
            $scope.messageDetils.push(message);
            $scope.$apply();  //手动刷新$scope页面
            $scope.scrollToBottom();  //滚动页面到最底部
        });

        /**
         * 跳转到聊天设置
         * 需要传递当前聊天好友的信息
         * id,姓名，电话，邮箱，头像，聊天记录
         */
        $scope.toChatSettings = function () {
            var id = $scope.chatTo;
            var data = {
                "id": id,
                "chatType": "chat"
            };
            data = angular.toJson(data);
            $state.go("chatSetting", {
                "data": data
            });
        };

        /**
         * 返回消息列表页面
         * 删除localstorage里面的内容
         */
        $scope.goback = function () {
            $rootScope.chatName=null;
            localStorageService.deleteLocalAllData(userInfoName+'unread' + $scope.chatTo);
        };

        /**
         * 打开表情面板
         */
        $scope.openExpressionPanel = function () {
            $scope.isShowExpressionPanel = !$scope.isShowExpressionPanel;
        };

        $scope.send_content = ''; //输入框里面的类容

        /**
         * 发送表情
         */
        $scope.sendface = function (actionKey) {
            $scope.send_content += actionKey;
        };
        //处理表情，返回表情所对应的文字描述
        $scope.faceData = faceService.faceMapping();

    }

    singleChatCtrl.$inject = ['$scope', '$stateParams', '$ionicScrollDelegate', '$state',
        '$rootScope', 'faceService', 'eventManagerService', 'localStorageService'];
    return singleChatCtrl;

});