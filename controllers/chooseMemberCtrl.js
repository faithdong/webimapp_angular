/**
 * Created by zhongxd on 2016/8/5.
 * 选择群成员
 */

define([],function () {
    'use strict';
    function chooseMemberCtrl($scope, $resource, $state, $ionicHistory, messageService, $stateParams) {

        var array = []; //用于记录组织机构跳转页面层级关系
        var index = 0;
        var button = document.getElementById("btn");
        var memberArry = []; //存放选中成员的数组;

        //请求本地组织架构数据
        var data = $resource('data/json/orglist.json');
        data.query(function (orgdata) {
            $scope.org = orgdata;
        });
        //15436103226为组织架构的根所以写死
        $scope.orgcode1 = '15436103226';

        /**
         * //进入下一级
         * @param uporgcode 上级机构号
         */
        $scope.openorg = function (uporgcode) {
            array[index++] = $scope.orgcode1;
            $scope.orgcode1 = uporgcode;
            button.style.display = "block";
        };

        /**
         * 返回
         */
        $scope.back = function () {
            if (index > 1) {
                $scope.orgcode1 = array[--index];
            } else {
                $scope.orgcode1 = array[--index];
                button.style.display = "none";
            }
        };
        /**
         * 取消
         */
        $scope.goBack = function () {
            var oselactAll = document.getElementsByClassName("selactAll")[0];
            var oselectMenber = document.getElementsByClassName("selectMember");
            for (var i = 0; i < oselectMenber.length; i++) {
                oselectMenber[i].checked = false;
            }
            oselactAll.checked = false;
            $scope.num = 0;
            $ionicHistory.goBack();
        };

        /**
         * 选择成员
         */
        $scope.selectMember = function (username) {
            var idx = memberArry.indexOf(username);
            if (idx != -1) {
                memberArry.splice(idx, 1);
            } else {
                memberArry.push(username);  //选中
                console.log(username)
            }
            $scope.num = memberArry.length;
        };

        /**
         * 全选
         */
        $scope.selactAll=function(){
            selactAll();
        }
        function selactAll(){
            memberArry.length=0;
            var oselactAll = document.getElementsByClassName("selactAll")[0];
            var oselectMenber = document.getElementsByClassName("selectMember");
            for (var i = 0; i < oselectMenber.length; i++) {
                if (oselactAll.checked == true) {
                    oselectMenber[i].checked = true;
                    memberArry.push(oselectMenber[i].getAttribute("data-username"));
                    console.log(oselectMenber[i].getAttribute("data-username"));
                } else {
                    oselectMenber[i].checked = false;
                }
            }
            $scope.num = memberArry.length;
        }
        /**
         * 点击确定返回给群页面
         */
        $scope.toGroupMember = function () {
            var groupName = $stateParams.groupname;  //接收的群名;
            groupName = angular.fromJson(groupName);
            //var name = groupName.groupName;
            var id = groupName.node;
            var flag=groupName.flag;
            var data = {
                id: id,
                ids: memberArry,
                to: id
            };
            console.log(data);
            messageService.AddUserToGroup(data, function (resultdata) {
                console.log(resultdata);
                console.log("新群员：" + memberArry);
                if(flag=="creategroup"){
                    $state.go("myGroup");
                }else {
                    //$state.go("groupmember",{
                    //    "data" :angular.toJson(data)
                    //});
                    $ionicHistory.goBack();
                }

            });

        };

        /**
         * 搜索
         */
        $scope.search = function () {
            $state.go("search");
        };

    }

    chooseMemberCtrl.$inject = ['$scope','$resource', '$state', '$ionicHistory', 'messageService', '$stateParams'];
    return chooseMemberCtrl;

});