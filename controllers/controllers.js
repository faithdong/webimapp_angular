/**
 * Created by zhongxd on 2016/8/4.
 * 控制器配置js，用于分离controller
 */

define(['angular','require','../js/app','services',
    'messageCtrl','singleChatCtrl','chatSettingCtrl','chatHistoryCtrl',
    'concatCtrl','searchCtrl','notifyListCtrl','notifyDetailCtrl',
    'personInfoCtrl','createGroupCtrl','myGroupCtrl','groupChatCtrl','groupMemberCtrl',
    'groupFileCtrl','memberInfoCtrl','chooseMemberCtrl','loginCtrl','testCtrl'],function(angular, require){
    var controllers = angular.module('IMApp.controllers',['IMApp.services']);
    //controllers.controller('controller名字',require(对应的文件地址));

    //ctrlA-message 消息
    controllers.controller('messageCtrl',require("messageCtrl"));
    controllers.controller('singleChatCtrl',require("singleChatCtrl"));
    controllers.controller('chatSettingCtrl',require("chatSettingCtrl"));
    controllers.controller('chatHistoryCtrl',require("chatHistoryCtrl"));

    //ctrlB-concat 联系人
    controllers.controller('concatCtrl',require("concatCtrl"));
    controllers.controller('searchCtrl',require("searchCtrl"));

    //ctrlC-notice 通告
    controllers.controller('notifyListCtrl',require("notifyListCtrl"));
    controllers.controller('notifyDetailCtrl',require("notifyDetailCtrl"));

    //ctrlD-mine 我的
    controllers.controller('personInfoCtrl',require("personInfoCtrl"));

    //ctrlE-group 群
    controllers.controller('createGroupCtrl',require("createGroupCtrl"));
    controllers.controller('myGroupCtrl',require("myGroupCtrl"));
    controllers.controller('groupChatCtrl',require("groupChatCtrl"));
    controllers.controller('groupMemberCtrl',require("groupMemberCtrl"));
    controllers.controller('groupFileCtrl',require("groupFileCtrl"));
    controllers.controller('memberInfoCtrl',require("memberInfoCtrl"));
    controllers.controller('chooseMemberCtrl',require("chooseMemberCtrl"));

    //登录
    controllers.controller('loginCtrl',require("loginCtrl"));

    //测试
    controllers.controller('testCtrl',require("testCtrl"));

    return controllers;
});