/**
 * Created by zhongxd on 2016/8/5.
 * 消息列表
 */

define(['app'],function () {
    'use strict';
    function messageCtrl($scope, $state, $rootScope,
                         localStorageService, messageService, eventManagerService, faceService) {
        /*
         * $rootScope.allNews  全局变量用于记录当前一共有多少条未读消息
         * $rootScope.chatName   全局变量用于记录当前打开的是与哪个的聊天页面
         *                      用于处理当前聊天窗口接到的消息未读消息条数还叠加的问题
         *                      默认值为null
         * */
        $rootScope.allNews=0;
        $rootScope.chatName=null;
        var msg;

        var localNews=0;  //将未读消息条数存到本地需要用到的参数


        var eventLocalStorage = localStorageService;
        //获取当前登录账号
        var userInfoName=eventLocalStorage.getLocalData('userInfo').username;

        //从本地localStorage获取联系人加载到列表

        var tabInformCount=eventLocalStorage.getLocalData(userInfoName+'tabsInformCount');
        if(tabInformCount){
            $rootScope.allNews=tabInformCount.allNewsCount;
        }
        //eventLocalStorage.deleteLocalAllData('linkManData');  //删除本地储存
        $scope.messages = eventLocalStorage. getLocalData(userInfoName+'linkManData');
        var messages = $scope.messages || [];
        //获取离线消息加载到页面
        messageService.GetOfflineMessage();
        //创建事件监听实例对象并处理消息事件
        var eventManager = eventManagerService.getInstance();
        eventManager.registerEventHandler('imTextMessageHandler', function (event, data) {
            dealMessage(data, 1,1);
            /*
             *未读消息的处理
             * 将收到的消息存到本地   以 unread+name 为key值
             * objData  根据发送人的信息取到的本地数据
             * */
            var formatContent = faceService.strCorventToFace(data.data.content);
            var newsData = {
                'name': data.from, 'content': formatContent, 'type': data.type,
                'contentType': data.data.contentType, 'time': data.data.dateline, 'id': data.id,
                'CName' :data.CName,'receiveMsgType':1
            };
            var objData = eventLocalStorage.getLocalData(userInfoName+'unread' + (data.from.room || data.from));
            objData=objData||[];
            objData.push(newsData);
            eventLocalStorage.addLocalData(userInfoName+(data.from.room ? 'unread' + data.from.room : 'unread' + data.from), objData);
            saveLinkMan(data,1,localNews);

        });
        //监听聊天页面发送的消息 并保存最后一条消息到本地
        eventManager.registerEventHandler('imSendMessage', function (event, data) {
            dealMessage(data, 2,1);
            saveLinkMan(data,1,0);
        });

        /**
         * 监听图片信息，保存到未读消息和联系人两个localstorage里面
         */
        eventManager.registerEventHandler('imPictureMessageHandler',function(event,data){
            if(!data || !data.data) return;
            dealMessage(data,1,2);
            if(typeof(data.data.content) == "object"){
                msg='<img src="'+data.data.content.path+'" alt="">';
            }else{
                msg=data.data.content;
            }
            var message = {
                'isFromeMe': false,'receiveMsgType':2,
                'name': data.from, 'content': msg, 'type': data.chat,
                'contentType': data.data.contentType, 'time': data.data.dateline
            };

            var objData = eventLocalStorage.getLocalData(userInfoName+'unread' + (data.from.room ? data.from.room : data.from));
            if (!objData) {
                objData = [];
            }
            objData.push(message);
            eventLocalStorage.addLocalData(userInfoName+(data.from.room ? 'unread' + data.from.room : 'unread' + data.from), objData);

            saveLinkMan(data,2,localNews);
        });

        /**
         *收到消息后对消息进行处理
         * dealType 1表示接收消息，2表示发送消息
         * dateType 1表示文本，2表示图片，3表示文件
         */
        function dealMessage(data, dealType,dateType) {
            var inmessageList = false,msg='';
            if(dateType==1){
                msg=data.data.content;
            }else if (dateType==2){
                msg="[图片]";
            }else if(dateType==3){
                msg="[文件]"
            }

            for(var i=0;i<messages.length;i++){
                if(messages[i].type == 'chat'&& messages[i].name == data.from){
                    messages[i].content = msg;
                    if (dealType == 1 && messages[i].name!=$rootScope.chatName) {
                        messages[i].newcount++;
                        $rootScope.allNews++;
                        localNews=messages[i].newcount;
                    }
                    messages[i].time = data.data.dateline;
                    inmessageList = true;
                    break;
                }

                else if (messages[i].type == 'groupchat'&& messages[i].id == data.from.room) {
                    messages[i].content = msg;
                    messages[i].time = data.data.dateline;
                    if (dealType == 1 && messages[i].id!=$rootScope.chatName) {

                        messages[i].newcount++;
                        $rootScope.allNews++;
                        localNews=messages[i].newcount;
                    }
                    inmessageList = true;

                    break;
                }
            }
            if (!inmessageList) {
                var obj = {
                    name:data.from,
                    content : msg,
                    type : data.type,
                    contentType : data.data.contentType,
                    time : data.data.dateline,
                    newcount : 1,
                    id : data.from.room
                };

                if (data.type == "groupchat") {
                    //通过本地保存的grouplist找到群名
                    var list = localStorageService.getLocalData("grouplist");
                    for(var i = 0;i<list.length;i++){
                        if(list[i].id == obj.id){
                            obj.CName = list[i].name;
                            data.CName = obj.CName;
                            data.id = obj.id;
                            break;
                        }
                    }
                }
                console.log("dealmessage 后data");
                console.log(data);
                messages.push(obj);
                $rootScope.allNews++;
                localNews=1;
                $scope.messages = messages;
            }
            saveAllNews($rootScope.allNews);
            $scope.$apply();
        }

        /**
         * 将最近联系人存到本地   以linkManData 为key值  里面存的是一个数组
         * linkmanData 根据联系人姓名或则群id得到的本地数据
         * @param data
         */
        function saveLinkMan(data,dataType,newscount) {
            //  alert("save时候"+data.CName);
            var msg=data.data.content;
            if(dataType==2){
                msg="[图片]"
            }else if(dataType==3){
                msg="[文件]"
            }
            var linkmanobj = {
                'key': data.from.room ? data.from.room : data.from,
                'name': data.from,
                'content': msg,
                'type': data.type,
                'contentType': data.data.contentType,
                'time': data.data.dateline,
                'id': data.id,
                'newcount':newscount,
                'CName' :data.CName
            };
            // alert(data.CName);
            var linkmanData = eventLocalStorage.getLocalData(userInfoName+'linkManData');
            if (linkmanData != null) {
                eventLocalStorage.updateLocalData(userInfoName+'linkManData', linkmanobj);
            } else {
                var tempArray = [linkmanobj];
                eventLocalStorage.addLocalData(userInfoName+'linkManData', tempArray);
            }
        }

        /*
         * 将tabs的提示条数存在本地
         * */

        function saveAllNews(count){
            var obj={allNewsCount:count};
            eventLocalStorage.addLocalData(userInfoName+'tabsInformCount', obj);
        }


        /**
         * 点击删除按钮删除当前列表
         * 删除localstorage里面的对应数据
         */
        $scope.deleteMessage = function (message) {
            $rootScope.allNews-=$scope.messages[$scope.messages.indexOf(message)].newcount;
            saveAllNews($rootScope.allNews);
            $scope.messages.splice($scope.messages.indexOf(message), 1);
            eventLocalStorage.deleteLocalAllData(userInfoName+'unread'+(message.name.room || message.name));
            eventLocalStorage.deleteLocalData(userInfoName+'linkManData', message);
        };

        /**
         * 根据type字段类型跳转到
         * 单聊页面或者群聊页面
         * @param message
         */
        $scope.messageDetils = function (message) {
            $rootScope.allNews-=$scope.messages[$scope.messages.indexOf(message)].newcount;
            saveAllNews($rootScope.allNews);
            $scope.messages[$scope.messages.indexOf(message)].newcount = 0;
            var linkmanData = eventLocalStorage.getLocalData(userInfoName+'linkManData');
            message.name=message.name.room || message.name;
            for(var i=0;i<linkmanData.length;i++){
                if(linkmanData[i].key==message.name){
                    linkmanData[i].newcount=0;
                    eventLocalStorage.updateLocalData(userInfoName+'linkManData', linkmanData[i]);
                    break;
                }
            }
            //判断单聊群聊
            if (message.type == "chat"){
                $rootScope.chatName=message.name;
                $state.go("messageDetail", {
                    "messageId": message.name
                })}
            else {
                $rootScope.chatName=message.id;
                var group = new Object();
                group.flag = "messagelist";
                group.id = message.id;
                group.name = message.CName;
                //根据id找群名称
                group = angular.toJson(group);
                $state.go("groupchat", {
                    "group": group
                });
            }
        };

        /**
         * zhongxd
         * 跳转到测试页面
         */
        $scope.test = function () {
            $state.go("test");
        };

        /**
         * zhongxd
         * 页面开始加载前需要加载的数据或者方法可以写在这里
         */
        $scope.$on("$ionicView.beforeEnter", function () {

        });

    };

    messageCtrl.$inject = ['$scope', '$state', '$rootScope',
        'localStorageService', 'messageService', 'eventManagerService', 'faceService'];
    return messageCtrl;

});