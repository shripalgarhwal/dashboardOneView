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

        function getClassName(grid, row, col, columnName, CONSTANTS) {
            var className = "";
            //console.log('columnName::::', columnName);
            if(columnName === 'isin') {

            }
            if(columnName === 'nav') {

            }
            if(columnName === 'currency') {

            }
            if(columnName === 'coreHoldingID') {

            }
            if(columnName === 'poe') {

            }
            if (grid.getCellValue(row, col).length === 0) {
                className = "red";
            }
            //if (row.entity[columnName].type === MY_CONSTANTS.EDIT && grid.getCellValue(row, col) < 0) {
            //    className = "red";
            //}

            return className;
        }
        vm.gridOptions = {
                            enableSorting: true,
                            enableFiltering: true,
                            enableGridMenu: true,
                            enablePinning:true,
                            useExternalFiltering: true,
                            columnDefs: [
                                { 
                                    field: 'Name',
                                    enablePinning: false,
                                    enableFiltering: true,
                                    menuItems: [
                                                  /*{
                                                    title: 'Outer Scope Alert',
                                                    icon: 'ui-grid-icon-info-circled',
                                                    action: function($event) {
                                                        //console.log('this.context::::', this.context);
                                                      //this.context.blargh(); // $scope.blargh() would work too, this is just an example
                                                    },
                                                    context: $scope
                                                  },*/
                                                  {
                                                    title: 'Currency',
                                                    action: function() {
                                                        this.grid.options.data = filterInGrid(vm.selectedFundFamilly, 'currency');
                                                    }
                                                  },
                                                  {
                                                    title: 'ISIN',
                                                    action: function() {
                                                      //console.log('ISIN::::', this.columnName);
                                                      this.grid.options.data = filterInGrid(vm.selectedFundFamilly, 'isin');
                                                    }
                                                  },
                                                  {
                                                    title: 'NAV',
                                                    action: function() {
                                                        this.grid.options.data = filterInGrid(vm.selectedFundFamilly, 'nav');
                                                        //console.log('nav::::', this.grid.options);
                                                    }
                                                  },
                                                  {
                                                    title: 'Core Holding Id',
                                                    action: function() {
                                                        this.grid.options.data = filterInGrid(vm.selectedFundFamilly, 'coreHoldingID');
                                                    }
                                                  },
                                                  {
                                                    title: 'POE',
                                                    action: function() {
                                                      this.grid.options.data = filterInGrid(vm.selectedFundFamilly, 'poe');
                                                    }
                                                  },
                                                  {
                                                    title: 'Show All',
                                                    action: function() {
                                                      this.grid.options.data = filterInGrid(vm.selectedFundFamilly, 'showAll');
                                                    }
                                                  }
                                                ]
                                },
                                {
                                    field: 'currency',
                                    enableFiltering: false,
                                    enablePinning:true,
                                    cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                                        return 'other-cells ' + getClassName(grid, row, col, 'currency');
                                    }
                                },
                                {
                                    field: 'isin',
                                    enableSorting: false, 
                                    enableFiltering: false,
                                    enablePinning:true,
                                    cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                                        return 'other-cells ' + getClassName(grid, row, col, 'isin');
                                    }
                                },
                                {
                                    field: 'nav',
                                    enableFiltering: false,
                                    enablePinning:true,
                                    cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                                        return 'other-cells ' + getClassName(grid, row, col, 'nav');
                                    }
                                },
                                {
                                    field: 'coreHoldingID',
                                    enableFiltering: false,
                                    enablePinning:true,
                                    cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                                        return 'other-cells ' + getClassName(grid, row, col, 'coreHoldingID');
                                    }
                                },
                                {
                                    field: 'poe',
                                    enableFiltering: false,
                                    enablePinning:true,
                                    cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                                        return 'other-cells ' + getClassName(grid, row, col, 'poe');
                                    }
                                }
                            ],
                            /*onRegisterApi: function( gridApi ) {
                                console.log('term111:::::');
                                  $scope.gridApi = gridApi;
                                    $scope.gridApi.core.on.filterChanged( $scope, function() {
                                      var grid = this.grid;

                                      if( grid.columns[1].filters[0].term === ' ' ) {
                                        console.log('term:::::');
                                        //$http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/100_male.json')
                                        //.success(function(data) {
                                          //$scope.gridOptions.data = data;
                                        //});
                                      }
                                    });
                            },*/
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
        function filterInGrid(arrayObj, field) {
            var getData = [];
            if(field === 'showAll') {
                getData = arrayObj;
            } else {
                angular.forEach(arrayObj, function(value, key) {
                    if(value[field] === '') {
                        getData.push(value);
                    }                
                });
            }
            
            return getData;            
        }
    }
}());