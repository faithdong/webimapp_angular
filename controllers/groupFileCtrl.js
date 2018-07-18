/**
 * Created by zhongxd on 2016/8/5.
 * 群文件
 */

define([],function () {
    'use strict';
    function groupFileCtrl($scope, $state,$stateParams,$ionicHistory,messageService,
                           bgIfService,localStorageService,eventManagerService) {

        var data = angular.fromJson($stateParams.data);
        data.receiver = data.id;
        var attachmentId;
        var index ;

        var obj = {};
        obj.id = data.id;
        obj.startPage = 1;

        //$scope.groupfile =
        //bgIfService.getGroupFileList(data, function (resultdata) {
        //    console.log("文件");
        //    console.log(resultdata);
        //    $scope.groupfile = resultdata.data;
        //});
        messageService.GetSharedFiles(obj,function(resultdata){
            console.log(resultdata);
            $scope.groupfile = resultdata;
        });


        //下载群文件
        $scope.downloadfile = function (file,index1) {
            console.log("下载文件");
            console.log(file);
            var url = messageService.GetFileUrl(file.attachmentId);
            attachmentId = file.attachmentId;
            index = index1;

            $file.download({
                "url" : url,//下载文件的url
                "locate" : "/storage/emulated/0/",//下载后文件存放的路径/
                "filename" : file.name,//下载后重命名的文件名
                "override" : "true",//下载后是否覆盖同名文件
                "callback" : "completeDownloadFile()"//下载后的回调方法,locate+filename可以访问文件(即download/image/newfile.png)
            });
        };

        //打开群文件
        $scope.openfile = function(file){

            $file.open({
                "filename" : file.name,//文件全路径  ??
                "filetype" : file.type, //支持手机能打开的格式*.txt,*.doc,*.pdf等
                "filepath" : "/storage/emulated/0/"
            });

        };

        var eventManager = eventManagerService.getInstance();
        eventManager.registerEventHandler('FileComplete', function (event, data) {
            alert("收到触发消息");
            alert(attachmentId);
            //var download = "download"+attachmentId;
            //var complete = "complete"+attachmentId;

            $summer.byId(attachmentId).style.display = "none";
            $summer.byId(index).style.display = "block";
        });

        $scope.goback = function(){
            $ionicHistory.goBack();
        }

    }

    groupFileCtrl.$inject = ['$scope','$state','$stateParams','$ionicHistory',
    'messageService','bgIfService','localStorageService','eventManagerService'];
    return groupFileCtrl;

});