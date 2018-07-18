/**
 * Created by zhongxd on 2016/8/5.
 * 新建群
 */

define([],function () {
    'use strict';
    function createGroupCtrl($scope, $state, messageService) {

        /**
         * 跳转到群列表页面
         */
        $scope.docancel = function () {
            $state.go("myGroup");
        };


        $scope.creategroup_next = function () {
            //创建群
            var jsonstr = $scope.creategroup_next.groupname;
            var json ={};
            json["groupName"] = jsonstr;

            //新建群
            messageService.CreateChatGroup(json, function (result) {
                // 成功跳转到选择群成员界面
                json["node"] = result.node;
                json.flag = "creategroup";
                var data = angular.toJson(json);
                $state.go("chooseMember", {
                    "groupname": data
                });
            })
        };

    }

    createGroupCtrl.$inject = ['$scope', '$state', 'messageService'];
    return createGroupCtrl;

});