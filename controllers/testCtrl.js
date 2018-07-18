/**
 * Created by zhongxd on 2016/8/5.
 * 测试 一些功能的调用
 * 不在生产环境使用此控制器
 */

define([],function () {
    'use strict';
    function testCtrl($scope, messageService, userService, DBService, notifyListService) {

        /**
         * //发送消息测试
         */
        $scope.sendMsgTest = function () {
            alert("sss");
        };

        /**
         * //新建群测试
         */
        $scope.AddGroup = function () {
            var dataObj = {
                groupName: '老钟测试群--2'
            };
            messageService.CreateChatGroup(dataObj, function (resultdata) {
                console.log(resultdata);
            });
        };

        /**
         * //添加群成员测试
         */
        $scope.AddGroupMember = function () {
            //8b369911
            var userNames = ['imtest07'];
            var dataObj = {
                roomId: "8b369911",
                ids: userNames
            };
            messageService.AddUserToGroup(dataObj, function (result) {
                alert(result);
            })
        };

        /**
         * //获取群列表测试
         * @constructor
         */
        $scope.GetGroupList = function () {
            messageService.GetGroupList(function (data) {
                console.log(data);
            })
        };

        /**
         * //获取成员表测试
         * @constructor
         */
        $scope.GetGroupMemberList = function () {
            var groupId = "8b369911";//群id
            var dataObj = {
                id: groupId
            };
            messageService.GetGroupMember(dataObj, function (resultdata) {
                console.log(resultdata);
            });
        };

        /**
         * //登录测试
         */
        $scope.login = function () {
            var dataObj = {
                loginName: 'imtest01',
                loginPassword: '12345678'
            };
            userService.login(dataObj, function (data) {
                var dt = data;
                console.log(dt);
            });
        };
        /**
         * 保存信息测试
         */
        $scope.saveMsg = function () {

            var msg1 = {"imtest01": {"content": "吃饭没有", "time": "10:36", "contentType": "2"}};
            var msg2 = {"imtest02": {"content": "深刻的风景", "time": "9:40", "contentType": "2"}};
            var msg3 = {name: "imtest01", "content": "3123sd", "date": "1:40"};
            /*DBService.createObjectStore(msgData,function(data){
             console.log(data);
             });*/

            //DBService.addMsgData(msg1);
            DBService.insertData();


        };

        /**
         * 通知列表测试
         */
        $scope.notifyList = function () {
            var dataObj = {
                page: 1,
                rows: 5
            };
            notifyListService.getNotifyList(dataObj, function (data) {
                console.log(data);
            });

        };

        /**
         * 聊天记录列表测试
         */
        $scope.chatList = function () {
            var dataObj = {
                id: 'imtest02', //对话人id
                chatType: 'chat', //chat:单聊，groupcgat:群聊,pubaccount:公众号
                //contentType: 2,//代表希望拿到的消息类型，不填则为全部消息类型
                start: 1, //消息列表的分页参数，起始值，默认0,
                num: 10 //消息列表的分页参数，分页参数，默认100
            };
            messageService.GetHistoryMessage(dataObj, function (data) {
                console.log(data);
            });
        }

    }

    testCtrl.$inject = ['$scope','messageService','userService','DBService','notifyListService'];
    return testCtrl;

});