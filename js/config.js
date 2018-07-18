/**
 * Created by zhongxd on 2016/8/3.
 * ionic配置文件 android 和ios ui界面的配置和动态效果
 */


define(['app','angular','ionic'], function (app,angular) {
    'use strict';
    return angular.module('app.config', ['ionic']).config(function($ionicConfigProvider) {
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('standard');
        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.views.transition('android');
        $ionicConfigProvider.platform.ios.views.transition('ios');
    });
});