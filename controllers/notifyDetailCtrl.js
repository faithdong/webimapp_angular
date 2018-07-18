/**
 * Created by zhongxd on 2016/8/5.
 * 通告详情
 */

define([],function () {
    'use strict';
    function notifyDetailCtrl($scope, $state, $stateParams) {
        //获取到消息列表传递的数据，并绑定到页面
        $scope.notifyContent = $stateParams.notifycontent;
        $scope.sendtime = $stateParams.sendtime;

        /**
         * 返回上一页
         */
        $scope.goBack = function () {
            $state.go('tab.notifyList');
        };

    }

    notifyDetailCtrl.$inject = ['$scope', '$state', '$stateParams'];
    return notifyDetailCtrl;

});