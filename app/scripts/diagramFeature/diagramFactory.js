"use strict"
angular.module('savingcalculatorApp')
    .factory('diagramFactory', function MainFactory($http, $q, $log) {
        return {
            getFinancialData: function () {
                return $http({
                    //url: 'https://api.mongolab.com/api/1/databases/savings/collections/financialdata',
                    url: 'http://peterdesktop.com:8080/financialData',
                    method: 'GET',
                    /*params: {
                        'apiKey': 'rLXW_SYqupDY0XvVv50ge8CVYUgrsMRZ'
                    }*/
                }).then(
                    function (response) {
                        if (typeof response.data === 'object') {
                            var result = [];
                            angular.forEach(response.data._embedded.financialData, function (value, key) {
                                $log.info(value);
                                var oid = value._links.self.href.split("/");
                                oid = oid[oid.length - 1];
                                this.push({
                                    "_id": {
                                        "$oid": oid
                                    },
                                    "financialData": value
                                });
                            }, result);


                            //$log.info(result);
                            //return response.data._embedded.financialData;
                            return result;
                        } else {
                            $log.error('Error: ' + JSON.stringify(response));
                            return $q.reject(response.data);
                        }
                    },
                    function (response) {
                        $log.error('Error: ' + JSON.stringify(response));
                        return $q.reject(response.data);
                    });
            },
            insertNewFinancialData: function (financialData) {
                return $http({
                    //url: 'https://api.mongolab.com/api/1/databases/savings/collections/financialdata',
                    url: 'http://peterdesktop.com:8080/financialData',
                    method: 'POST',
                    data: financialData
                        /*params: {
                            'apiKey': 'rLXW_SYqupDY0XvVv50ge8CVYUgrsMRZ'
                        }*/
                }).then(
                    function (response) {
                        if (response.status == 201) {
                            $log.info(response);
                            return response;
                        } else {
                            $log.error('Error: ' + JSON.stringify(response));
                            return $q.reject(response);
                        }
                    },
                    function (response) {
                        $log.error('Error: ' + JSON.stringify(response));
                        return $q.reject(response.data);
                    });
            },
            deleteFinancialData: function (financialData) {
                return $http({
                    //url: 'https://api.mongolab.com/api/1/databases/savings/collections/financialdata/' + id.$oid,
                    //url: 'http://peterdesktop.com:8080/financialData/' + id.$oid,
                    url: financialData._links.self.href,
                    method: 'DELETE'
                }).then(
                    function (response) {
                        if (response.status == 204) {
                            $log.info(response);
                            return response;
                        } else {
                            $log.error(response);
                            return $q.reject(response);
                        }
                    },
                    function (response) {
                        $log.error('Error: ' + JSON.stringify(response));
                        return $q.reject(response);
                    });
            },
            updateFinancialData: function (financialData) {
                return $http({
                    //url: 'https://api.mongolab.com/api/1/databases/savings/collections/financialdata/' + id.$oid,
                    //url: 'http://peterdesktop.com:8080/financialData/' + id.$oid,
                    url: financialData._links.self.href,
                    method: 'PUT',
                    data: financialData
                }).then(
                    function (response) {
                        if (response.status == 204) {
                            $log.info(response);
                            return response;
                        } else {
                            $log.error('Error: ' + JSON.stringify(response));
                            return $q.reject(response);
                        }
                    },
                    function (response) {
                        $log.error('Error: ' + JSON.stringify(response));
                        return $q.reject(response);
                    });
            }
        };
    });