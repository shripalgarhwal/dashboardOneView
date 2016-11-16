(function() {
    'use strict';
    angular.module('app.dashboard')
    .controller('categoryCommentPopupCtrl', appController);
    appController.$inject = ['$scope', '$uibModalInstance', 'item'];
    function appController($scope, $uibModalInstance, item) {
    	var ctrl = this;
        ctrl.item = item;
        ctrl.comment = item.comment;
        ctrl.viewComment = true;
        ctrl.editViewComment = function() {
            ctrl.viewComment = !ctrl.viewComment;
        }
        ctrl.ok = function () {
            $uibModalInstance.close(ctrl.item);
        };

        ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }       
}());