/**
 * Created by zhongxd on 2016/8/2.
 * 手动方式启动angularJS
 */

define(['ionic', 'angular', 'app'], function (ionic, angular) {
    'use strict';

    //angular.bootstrap(document, [app.name]); //直接启动，不做任何处理及准备

    angular.element(document).ready(function () {
        console.log("bootstrap ready");

        var startApp = function () {
            angular.bootstrap(document, ["IMApp"]);
        };

        var onDeviceReady = function () {
            console.log("on deviceready");
            angular.element().ready(function () {
                startApp();
            });
        };

        if (typeof cordova === 'undefined') {
            startApp();
        } else {
            document.addEventListener("deviceready", onDeviceReady, false);
        }
    });


});
