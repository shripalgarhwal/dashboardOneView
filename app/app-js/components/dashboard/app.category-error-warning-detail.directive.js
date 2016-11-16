(function() {
	'use strict';
	angular.module('app.dashboard')
        .directive('categoryErrorWarningDetails', function () {
            return {
                restrict: 'E',
                templateUrl: 'app-js/components/dashboard/category-error-warning-details.html',
                scope: {
                    selectedFundFamilly: '=selectedFundFamilly',
                    fundName: '=',
                    fundGraph: '@fundGraphData',
                    pieData: '@pieData'
                },
                controller: categoryErrorWarningDetailsCtrl,
                controllerAs: 'vm'
            };
        });
    function categoryErrorWarningDetailsCtrl($scope, fundDataService) {
        var vm = this;
        //console.log('selectedFundFamilly::::', $scope.selectedFundFamilly);
        vm.fundGraphData
        var totalCount = 0;
        vm.totalErrorInFunds = 0;
        vm.missingField = {
            'currency': '',
            'coreHoldingID': '',
            'poe': '',
            'nav': '',
            'isin': ''
        };
        vm.titles = ['Total Missing Fields As of Date: ', 'Missing Fields in Fund ID '];
        vm.pieDataTitle = vm.titles[0];
        console.log('selectedFundFamilly111::::', $scope.selectedFundFamilly);
        vm.selectedFundFamilly = $scope.selectedFundFamilly;
        
        //vm.selectedFund = '';
        vm.selectedFund = vm.selectedFundFamilly[0].Name;
        //vm.fundName = $scope.fundName;
        vm.chartOptions = fundDataService.getOptionsData();
        vm.fundGraphData = getTotalCount([JSON.parse($scope.fundGraph)], false);
        vm.pieData = getTotalCount(JSON.parse($scope.pieData), true)
        vm.toggleFundTree = function(fund) {
            fund.visible.fund = !fund.visible.fund;
        }
        vm.toggleExpendChildren = function(fund, key) {
            fund.visible[key] = !fund.visible[key];
        }
        vm.getSysmbolForChild = function(fund, key) {            
            if(fund.visible[key]) {
                return 'fa fa-minus-square';
            } else {
                return 'fa fa-plus-square'
            }
        }
        vm.selectFundForGraph = function(fundItem) {
            vm.selectedFund = fundItem.Name;
            vm.fundGraphData = [];
            vm.fundGraphData = getTotalCount([fundItem], false);
        }
        function getTotalCount(funds, addInMissingObj) {
            console.log('ffff:::::');
            var dataArray = [];
            angular.forEach(vm.missingField, function(value, key) {
                totalCount = 0;
                filterMissing(funds, key);
                if(addInMissingObj) {
                  vm.missingField[key] = totalCount;
                  //totalError += totalCount;
                }
                dataArray.push({
                    name: key,
                    y: totalCount
                });                
            });
            if(addInMissingObj) {
                vm.totalErrorInFunds = totalErrorInFunds();
            }
            return dataArray;
        }
        function filterMissing(arrayObj, field) {
            angular.forEach(arrayObj, function(value, key) {
                if(value[field] === '') {
                    totalCount++;
                }
                if(value.children) {
                    if(value.children.length > 0) {
                        filterMissing(value.children, field);
                    }
                }
            });
        }
        function totalErrorInFunds() {
            var totalError = 0;
            angular.forEach(vm.missingField, function(value, key) {
                totalError += Number(vm.missingField[key]);
            });
            return totalError;
        }


        // ---  ui-grid ------
        vm.gridOptions = {
                            enableSorting: true,
                            enableFiltering: true,
                            enableGridMenu: true,
                            enablePinning:true,
                            columnDefs: [
                                { 
                                    field: 'Name',
                                    enablePinning: false
                                },
                                {
                                    field: 'currency', 
                                    enablePinning:true
                                },
                                {
                                    field: 'isin',
                                    enableSorting: false, 
                                    enableFiltering: false,
                                    enablePinning:true
                                },
                                {
                                    field: 'nav',
                                    enableFiltering: false,
                                    enablePinning:true
                                },
                                {
                                    field: 'coreHoldingID',
                                    enablePinning:true
                                },
                                {
                                    field: 'poe',
                                    enableFiltering: false,
                                    enablePinning:true
                                }
                            ],
                            data: [
                                    { 
                                        Name: 'Category Name',
                                        Currency: 'Currency',
                                        ISIN: 'ISIN',
                                        NAV: 'NAV',
                                        CoreHoldingID: 'Core Holding ID',
                                        POE: 'POE'
                                    }
                                ]
                        };
        vm.gridOptions.data = vm.selectedFundFamilly;
        vm.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
            if( col.filters[0].term ){
            return 'header-filtered';
            } else {
            return '';
            }
        }
    }
}());