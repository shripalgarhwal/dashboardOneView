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
        var columnNames = [
            {
                field: 'Name',
                name: 'Name'
            },
            {
                field: 'currency',
                name: 'Currency'
            },
            {
                field: 'isin',
                name: 'ISIN'
            },
            {
                field: 'nav',
                name: 'NAV'
            },
            {
                field: 'coreHoldingID',
                name: 'Core Holding ID'
            },
            {
                field: 'poe',
                name: 'POE'
            }
        ];
        function getClassName(grid, row, col, columnName, CONSTANTS) {
            var className = '';
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
            if (grid.getCellValue(row, col) != undefined) {
                if (grid.getCellValue(row, col).length === 0) {
                    className = 'red';
                }
            }
            //if (row.entity[columnName].type === MY_CONSTANTS.EDIT && grid.getCellValue(row, col) < 0) {
            //    className = 'red';
            //}

            return className;
        }
        
        vm.gridOptions = {
                            enableSorting: true,
                            enableFiltering: true,
                            enableGridMenu: true,
                            enablePinning:true,
                            showTreeExpandNoChildren: true,
                            columnDefs: [
                                { 
                                    field: columnNames[0].field,
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
                                                    title: columnNames[1].name,
                                                    action: function() {
                                                        this.grid.options.data = filterInGrid(vm.selectedFundFamilly, columnNames[1].field);
                                                    }
                                                  },
                                                  {
                                                    title: columnNames[2].name,
                                                    action: function() {
                                                      //console.log('ISIN::::', this.columnName);
                                                      this.grid.options.data = filterInGrid(vm.selectedFundFamilly, columnNames[2].field);
                                                    }
                                                  },
                                                  {
                                                    title: columnNames[3].name,
                                                    action: function() {
                                                        this.grid.options.data = filterInGrid(vm.selectedFundFamilly, columnNames[3].field);
                                                        //console.log('nav::::', this.grid.options);
                                                    }
                                                  },
                                                  {
                                                    title: columnNames[4].name,
                                                    action: function() {
                                                        this.grid.options.data = filterInGrid(vm.selectedFundFamilly, columnNames[4].field);
                                                    }
                                                  },
                                                  {
                                                    title: columnNames[5].name,
                                                    action: function() {
                                                      this.grid.options.data = filterInGrid(vm.selectedFundFamilly, columnNames[5].field);
                                                    }
                                                  },
                                                  {
                                                    title: 'Show All',
                                                    action: function() {
                                                      this.grid.options.data = filterInGrid(vm.selectedFundFamilly, 'showAll');
                                                    }
                                                  },
                                                  {
                                                    title: 'Group All',
                                                    action: function() {
                                                      this.grid.options.data = groupAll(vm.selectedFundFamilly);
                                                    }
                                                  }
                                                ]
                                },
                                {
                                    field: columnNames[1].field,
                                    enableFiltering: false,
                                    enableSorting: false,
                                    enablePinning: false,
                                    cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                                        return 'other-cells ' + getClassName(grid, row, col, columnNames[1].field);
                                    },
                                    menuItems: [
                                        {
                                            title: 'Group',
                                            action: function() {
                                              this.grid.options.data = groupByColumnName(vm.selectedFundFamilly, columnNames[1]);
                                            }
                                        }
                                    ]
                                },
                                {
                                    field: columnNames[2].field,
                                    enableFiltering: false,
                                    enableSorting: false,
                                    enablePinning: false,
                                    cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                                        return 'other-cells ' + getClassName(grid, row, col, columnNames[2].field);
                                    },
                                    menuItems: [
                                        {
                                            title: 'Group',
                                            action: function() {
                                              this.grid.options.data = groupByColumnName(vm.selectedFundFamilly, columnNames[2]);
                                            }
                                        }
                                    ]
                                },
                                {
                                    field: columnNames[3].field,
                                    enableFiltering: false,
                                    enableSorting: false,
                                    enablePinning: false,
                                    cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                                        return 'other-cells ' + getClassName(grid, row, col, columnNames[3].field);
                                    },
                                    menuItems: [
                                        {
                                            title: 'Group',
                                            action: function() {
                                              this.grid.options.data = groupByColumnName(vm.selectedFundFamilly, columnNames[3]);
                                            }
                                        }
                                    ]
                                },
                                {
                                    field: columnNames[4].field,
                                    enableFiltering: false,
                                    enableSorting: false,
                                    enablePinning: false,
                                    cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                                        return 'other-cells ' + getClassName(grid, row, col, columnNames[4].field);
                                    },
                                    menuItems: [
                                        {
                                            title: 'Group',
                                            action: function() {
                                              this.grid.options.data = groupByColumnName(vm.selectedFundFamilly, columnNames[4]);
                                            }
                                        }
                                    ]
                                },
                                {
                                    field: columnNames[5].field,
                                    enableFiltering: false,
                                    enableSorting: false,
                                    enablePinning: false,
                                    cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                                        return 'other-cells ' + getClassName(grid, row, col, columnNames[5].field);
                                    },
                                    menuItems: [
                                        {
                                            title: 'Group',
                                            action: function() {
                                              this.grid.options.data = groupByColumnName(vm.selectedFundFamilly, columnNames[5]);
                                            }
                                        }
                                    ]
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
        //vm.selectedFundFamilly[0].$$treeLevel = 0;
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
        function groupAll(items) {
            var collectionItems = [];
            angular.forEach(columnNames, function(value, index) {
                if(index !== 0) {
                    angular.forEach(groupByColumnName(items, value),
                        function(item) {
                        collectionItems.push(item);
                    });                    
                } 
            });
            return collectionItems;
        }
        function groupByColumnName(items, colName) {
            var firstItem = {
                Name: colName.name,
                /*currency: '',
                coreHoldingID: '',
                poe: '',
                nav: '',
                isin: ''*/
            };
            var collectionItems = [];
            collectionItems.push(firstItem);
            angular.forEach(filterInGrid(items, colName.field), function(item) {
                collectionItems.push(item);
            });
            collectionItems[0].$$treeLevel = 0;
            return collectionItems;
        }
    }
}());