/**
 * Created by zhongxd on 2016/8/5.
 * 群成员列表
 */

define(['angular'],function (angular) {
    'use strict';
    function groupMemberCtrl($scope, $stateParams, $state, $timeout,messageService ) {

        //从上级页面获取传递的成员数据
        var data = angular.fromJson($stateParams.data);
        //获取群成员
        messageService.GetGroupMember(data, function (memberList) {
            $timeout(function () {
                console.log('执行$timeout回调');
                $scope.groupmembers = memberList;
            }, 500);
        });

        /**
         * 返回到群聊页面
         */
        $scope.goback = function () {
            var data1 = new Object();
            data1.id = data.id;
            data1.name = data.name;
            data1.flag = data.flag;
            $state.go("groupChat", {
                "group": angular.toJson(data1)
            });
        };

        /**
         * 跳转到 选择群成员页面，并构造传递的参数到群成员选择页面
         * @constructor
         */
        $scope.ToChooseMember = function () {
            var obj = new Object();
            obj.node = data.id;
            obj.groupName = data.name;
            var data2 = angular.toJson(obj);
            $state.go("chooseMember", {
                "groupname": data2
            });
        };

        /**
         * 跳转到聊天记录
         */
        $scope.toChatHistory = function () {
            var data = $stateParams.data;
            data = angular.fromJson(data);
            var org = data;
            org = angular.toJson(org);
            //alert("id:" + data.id + "name:" + data.name + "type:" + data.chatType);
            $state.go("chatHistory", {
                "org": org
            });
        };

        /**
         * 退出群
         */
        $scope.exit = function () {
            var data = $stateParams.data;
            data = angular.fromJson(data);
            var id = data.id;
            messageService.ExitChatGroup(id, function () {
                console.log("退出群成功");

                $state.go("myGroup");
            });

        };

        /**
         * 跳转到群文件列表页面
         */
        $scope.gotogroupfile = function () {
            $state.go("groupFile", {
                data: $stateParams.data
            });
        };

    }

    groupMemberCtrl.$inject = ['$scope','$stateParams','$state','$timeout','messageService'];
    return groupMemberCtrl;

});