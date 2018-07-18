/**
 * Created by zhongxd on 2016/8/5.
 * 群成员信息
 */

define(['angular'],function (angular) {
    'use strict';
    function memberInfoCtrl($scope, $stateParams, $ionicHistory, $state) {

        var data = $stateParams.info;
        data = angular.fromJson(data);
        $scope.name = data.name;
        $scope.tel = data.telephone_number;
        $scope.email = data.email;
        $scope.apart = data.department;
        $scope.pic = data.pic;
        if ($scope.pic) {
            $scope.pic = data.pic;
        } else {
            $scope.pic = "img/adam.jpg"
        }
        /**
         * 跳转到单聊页面
         */
        $scope.sendInfo = function () {
            $state.go("messageDetail", {
                "messageId": $scope.name
            });
        };

        /**
         * 返回上级页面
         */
        $scope.return = function () {
            $ionicHistory.goBack();
        };

    }

    memberInfoCtrl.$inject = ['$scope','$stateParams','$ionicHistory','$state'];
    return memberInfoCtrl;

});