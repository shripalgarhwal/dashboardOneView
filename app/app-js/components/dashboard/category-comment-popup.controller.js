(function() {
    'use strict';
    angular.module('app.dashboard')
    .controller('categoryCommentPopupCtrl', appController);
    appController.$inject = ['$scope', '$uibModalInstance', 'item', 'recentDate', 'type'];
    function appController($scope, $uibModalInstance, item, recentDate, type) {
    	var ctrl = this;
        ctrl.item = item;
        ctrl.comment = item.comment;
        ctrl.viewComment = true;
        function init() {
            if(type === 'Edit') {
                ctrl.viewComment = false;
            }
        }
        ctrl.editViewComment = function() {
            ctrl.viewComment = !ctrl.viewComment;
        }
        ctrl.ok = function () {
            $uibModalInstance.close({item: ctrl.item, recentDate: recentDate, type: type});
        };

        ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        init();
    }       
}());