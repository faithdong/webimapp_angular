/**
 * Created by zhongxd on 2016/8/5.
 * 我的群列表
 */

define([],function () {
    'use strict';
    function myGroupCtrl($scope, $state, messageService) {

        //获取群列表
        messageService.GetGroupList(function (resultdata) {
            //$timeout(function () {
            //    console.log('执行$timeout回调');

            //  alert("回调执行"+resultdata.length);
            $scope.groups = resultdata;
            $scope.$apply();

            //  }, 500);
        });


        /**
         * 跳转到群聊页面
         */
        $scope.gotogroupchat = function (group) {
            var data = angular.toJson(group);
            $state.go("groupChat", {
                "group": data
            });
        };

        /**
         * 跳转到创建群页面
         */
        $scope.addgroup = function () {
            $state.go("createGroup");
        };

        /**
         * 返回上一页
         */
        $scope.goback = function () {
            $state.go("tab.concat");
        };

    }

    myGroupCtrl.$inject = ['$scope','$state','messageService'];
    return myGroupCtrl;

});