/**
 * Created by zhongxd on 2016/8/5.
 * 群聊
 */

define(['angular'],function (angular) {
    'use strict';
    function groupChatCtrl($scope, $stateParams,$ionicScrollDelegate,
                           $state,$rootScope, faceService,
                           messageService, eventManagerService, localStorageService) {


        var userInfoName=localStorageService.getLocalData('userInfo').username;
        var tempmessage = [];
        /*if (tempmessage.length >= 3) {
         tempmessage.splice(0, 1);
         }*/

        // $scope.messageDetils = tempmessage;

        //定义滚动视图，scrollToBottom，scrollToTop方法时触发，由框架帮忙计算滚动位置
        $ionicScrollDelegate.$getByHandle('groupMessageScroll');


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

        $scope.$on("$ionicView.enter", function () {
            $ionicScrollDelegate.scrollBottom([true]);
        });
        //用于是否展示表情面板boolean值
        $scope.isShowExpressionPanel = false;

        $scope.send_content = ''; //输入框里面的初始内容

        //格式化接收到的参数
        $scope.group = angular.fromJson($stateParams.group);

        /**
         * 跳转到群成员列表页面
         */
        $scope.gotogroupmembers = function () {
            var data = {
                "id": $scope.group.id,
                "name": $scope.group.name,
                "flag" :$scope.group.flag,
                "chatType": "groupchat"
            };
            data = angular.toJson(data);
            $state.go("groupMember", {
                data: data
            });

        };

        /**
         * 判断返回进入聊天列表还是群列表
         */
        $scope.goback = function () {
            $rootScope.chatName=null;
            if ($scope.group.flag == "messagelist") {
                $rootScope.chatName=null;
                var userInfoName=localStorageService.getLocalData('userInfo').username;

                localStorageService.deleteLocalAllData(userInfoName+'unread'+$scope.group.id);
                $state.go("tab.message");
            }
            else
                $state.go("myGroup");
        };
        /**
         * 进入时从本地获取未读消息
         */
        var newsData = localStorageService.getLocalData(userInfoName+'unread' + $scope.group.id);
        newsData = newsData?newsData:[];

        //没有未读消息就从本地数据获取最近的一条消息
        if(newsData.length<=0){
            var linkmanData = localStorageService.getLocalData(userInfoName+'linkManData');
            if(linkmanData){
                var i;
                for( i = 0;i<linkmanData.length;i++){
                    if(linkmanData[i].key==$scope.group.id){
                        newsData.push( linkmanData[i] );
                        break;
                    }
                }

            }
        }

        $scope.messageDetils = newsData ;


        //创建监听实例
        var eventManager = eventManagerService.getInstance();

        /**
         * 注册接收消息监听实例
         * 用于实时获取到消息通知
         */

        /**
         * 接收消息
         * 文本表情
         */
        eventManager.registerEventHandler('imTextMessageHandler', function (event, data) {

            var storedata = localStorageService.getLocalData("userInfo");

            var self_id = storedata.username;
            if (data.type == "groupchat" && data.from.room == $scope.group.id && data.from.roster != self_id) { //本群的消息接收


                if (newsData.length >= 15) {
                    newsData.splice(0, 1);
                }
                //处理时间
                //  var date = new Date(data.data.dateline);
                // data.data.dateline = date.getHours() + ":" + date.getMinutes();
                data.isFromeMe = false;
                data.receiveMsgType = 1;
                //消息face处理
                data.content = faceService.strCorventToFace(data.data.content);

                //时间本地存储为data.time
                data.time =   data.data.dateline ;

                newsData.push(data);

                $scope.$apply();
                $scope.scrollToBottom();  //滚动页面到最底部

            }
        });

        /**
         * 接收图片信息
         */
        eventManager.registerEventHandler('imPictureMessageHandler',function(event,data){
            console.log("图片");
            console.log(data);
            //var msg = {};
            var msg;
            var storedata = localStorageService.getLocalData("userInfo");

            var self_id = storedata.username;
            if (data.type == "groupchat" && data.from.room == $scope.group.id && data.from.roster != self_id) { //本群的消息接收
                if (typeof(data.data.content) == "object") { //接收的是图片
                    msg = data.data.content.path;
                    //msg = data.data.content;
                    //msg.url = msg.path;
                } else { //接收的是对方发送的截图
                    msg = data.data.content;
                }
                if (newsData.length >= 15) {
                    newsData.splice(0, 1);
                }
                //处理时间
                // var date = new Date(data.data.dateline);
                //  data.data.dateline = date.getHours() + ":" + date.getMinutes();
                //时间本地存储为data.time
                data.time =   data.data.dateline ;
                data.isFromeMe = false;
                data.receiveMsgType = 2;
                data.content = "<img src='"+msg+"' >";
                //  data.msg = [];
                // data.msg.path = msg;


                newsData.push(data);

                $scope.$apply();  //手动刷新$scope页面
                $scope.scrollToBottom();  //滚动页面到最底部
            }
        });

        /**
         * 接收文件信息
         */
        eventManager.registerEventHandler("imFileMessageHandler",function(event,data){  //暂未修改
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
         * 发送群聊消息
         */
        $scope.sendMessage = function () {
            var msg = $scope.send_content;

            //事件监听参数，用于通知消息列表页面获取最新消息
            var arg = {
                from: {
                    room:$scope.group.id, //群id
                },
                data: {
                    content: $scope.send_content,
                    contentType: '', //暂时用不到
                    dateline: new Date().getTime()
                },
                type: "groupchat",
                isFromeMe :true
            };
            eventManager.trigger("imSendMessage", arg);

            var data = {};
            //构造发送消息需要的参数
            data.toid = $scope.group.id;
            data.type = "groupchat";
            data.msg = msg;
            messageService.SendMessage(data);

            //处理时间
            // var date = new Date();
            //  data.data = {};
            //  data.data.dateline = date.getHours() + ":" + date.getMinutes();
            //时间本地存储为data.time
            data.time = new Date().getTime() ;
            data.isFromeMe = true;
            data.sendMsgType=1;
            //消息face处理
            data.content = faceService.strCorventToFace(msg);
            newsData.push(data);
            $scope.send_content="";
            $scope.$apply();
            $scope.scrollToBottom();  //滚动页面到最底部
            $scope.isShowExpressionPanel = false;

        };

        /**
         * 显示与隐藏表情面板
         */
        $scope.openExpressionPanel = function () {
            $scope.isShowExpressionPanel = !$scope.isShowExpressionPanel;
        };

        /**
         * 发送表情
         */
        $scope.sendface = function (actionKey) {
            $scope.send_content += actionKey;
        };

        /**
         * 处理表情后获取到
         * 表情对应的文字描述
         */
        $scope.faceData = faceService.faceMapping();
        /**
         * 发送图片
         * 需要调用UAPMobile的API访问相册
         */
        $scope.sendPic = function(){

            $camera.openPhotoAlbum ({
                bindfield : "picimg",
                callback:"photoAlbumCallback()",
            });
        };

    }

    groupChatCtrl.$inject = ['$scope','$stateParams','$ionicScrollDelegate','$state',
    '$rootScope','faceService','messageService','eventManagerService','localStorageService'];
    return groupChatCtrl;

    /**
     * 发送图片，UAPMobile打开相册API回调函数
     */
    function photoAlbumCallback(args){
        if ($summer.os == "android"){
            alert("进入相册回调");
            alert(args);
            $summer.byId("picture").src = args.image;
            //var eventManager = EventManager.getInstance;
            ///eventManager.trigger("photoAlbumCallback",img);
        }

    }

});