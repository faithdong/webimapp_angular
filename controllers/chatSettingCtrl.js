/**
 * Created by zhongxd on 2016/8/5.
 * 聊天设置
 */

define(['angular'],function (angular) {
    'use strict';
    function chatSettingCtrl($scope, $stateParams, $state) {

        //获取到上级页面(单聊)传递的参数，并作处理
        var data = $stateParams.data;
        data = angular.fromJson(data);
        $scope.name = data.name || "";
        $scope.tel = data.tel || "";
        $scope.email = data.email || "";
        $scope.pic = data.pic || "";
        if ($scope.pic) {
            $scope.pic = data.pic;
        } else {
            $scope.pic = "img/adam.jpg"
        }

        /**
         * 跳转到聊天记录
         */
        $scope.toChatHistory = function () {
            var data = $stateParams.data;
            data = angular.fromJson(data);
            console.log("聊天类型:" + data.chatType);
            var org = {
                "id": data.id,
                "chatType": data.chatType
            };
            org = angular.toJson(org);
            //跳转到聊天记录页面
            $state.go("chatHistory", {
                "org": org
            });
        };

    }

    chatSettingCtrl.$inject = ['$scope', '$stateParams', '$state'];
    return chatSettingCtrl;

});