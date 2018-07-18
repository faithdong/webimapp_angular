/**
 * Created by zhongxd on 2016/8/5.
 * 我的信息
 */

define([],function () {
    'use strict';
    function personInfoCtrl($scope,$state, localStorageService,messageService) {

        //从localStoage获取到用户信息
        var data = localStorageService.getLocalData("userInfo");
        if (data == null) {
            return;
        }
        console.log(data);
        $scope.name = data.name || "";
        $scope.tel = data.tel || "";
        $scope.email = data.user_principal_name || "";
        $scope.apart = data.department || "";
        $scope.version = data.version || "当前版本为8.0";

        /**
         * 设置头像
         * $camera.open()
         * 调用UAPMobile设备API
         */
        $scope.setHead = function () {
            try {
                $camera.open({
                    bindfield: "image",
                    callback: "setHeadCallback()" //此回调函数必须是全局函数
                });
            } catch (e) {
                console.log(e);
            }
        };
        /**
         * 退出登录
         */
        $scope.exit=function(){
            localStorageService.deleteLocalAllData(data);
            messageService.LoginOut()
            $state.go("login");
        }

    }

    personInfoCtrl.$inject = ['$scope','$state','localStorageService','messageService'];
    return personInfoCtrl;

});