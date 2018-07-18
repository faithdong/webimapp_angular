/**
 * Created by zhongxd on 2016/8/5.
 * 搜索
 */

define([],function () {
    'use strict';
    function searchCtrl($scope, $resource, $ionicHistory, $state,$rootScope) {
        //读取本地组织架构json数据,并绑定到页面
        var data = $resource('data/json/org.json');
        data.query(function (orgdata) {
            //读取集合中的第一个用户
            $scope.personData = orgdata;
        });

        /**
         * 进入聊天页面
         */
        $scope.goChat = function (name) {
            $rootScope.chatName=name;
            $state.go("messageDetail", {
                "messageId": name
            });
        };

        /**
         * 返回上一页
         */
        $scope.goBack = function () {
            $ionicHistory.goBack();
        };

    }

    searchCtrl.$inject = ['$scope', '$resource', '$ionicHistory', '$state','$rootScope'];
    return searchCtrl;

});