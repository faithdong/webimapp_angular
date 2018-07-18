/**
 * Created by zhongxd on 2016/8/2.
 * 应用启动入口js
 */

define(['angular', 'ionic', 'ionicAngular','routers', 'controllers'], function (angular) {
    var app = angular.module('IMApp', ['ionic', 'ngResource','IMApp.routes', 'IMApp.controllers']);
    app.config(['$ionicConfigProvider', function ($ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('bottom');
    }]);

    app.run(function ($ionicPlatform) {
        //初始化webSDK
        //initYYIMSDKService.init();

        //当设备（手机）就绪调用此回调函数
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

});
