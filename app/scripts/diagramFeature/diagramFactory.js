"use strict"
angular.module('savingcalculatorApp')
    .factory('diagramFactory', function MainFactory($http, $q, $log) {
        return {
            getFinancialData: function() {
                return $http({
                    url: 'https://api.mongolab.com/api/1/databases/savings/collections/financialdata',
                    method: 'GET',
                    params: {
                        'apiKey': 'rLXW_SYqupDY0XvVv50ge8CVYUgrsMRZ'
                    }
                }).then(
                    function(response) {
                        if (typeof response.data === 'object') {
                            $log.info(response);
                            return response.data;
                        }
                        else {
                            $log.error('Error: ' + JSON.stringify(response));
                            return $q.reject(response.data);
                        }
                    },
                    function(response) {
                        $log.error('Error: ' + JSON.stringify(response));
                        return $q.reject(response.data);
                    });
            },
            insertNewFinancialData: function(dream) {
                return $http({
                    url: 'https://api.mongolab.com/api/1/databases/savings/collections/financialdata',
                    method: 'POST',
                    data: {
                        financialData: dream
                    },
                    params: {
                        'apiKey': 'rLXW_SYqupDY0XvVv50ge8CVYUgrsMRZ'
                    }
                }).then(
                    function(response) {
                        if (typeof response.data === 'object') {
                            $log.info(response);
                            return response.data;
                        }
                        else {
                            $log.error('Error: ' + JSON.stringify(response));
                            return $q.reject(response.data);
                        }
                    },
                    function(response) {
                        $log.error('Error: ' + JSON.stringify(response));
                        return $q.reject(response.data);
                    });
            },
            deleteFinancialData: function(id) {
                $log.debug(id);
                return $http({
                    url: 'https://api.mongolab.com/api/1/databases/savings/collections/financialdata/' + id.$oid,
                    method: 'DELETE',
                    params: {
                        'apiKey': 'rLXW_SYqupDY0XvVv50ge8CVYUgrsMRZ'
                    }
                }).then(
                    function(response) {
                        if (typeof response.data === 'object') {
                            $log.info(response);
                            return response.data;
                        }
                        else {
                            $log.error('Error: ' + JSON.stringify(response));
                            return $q.reject(response.data);
                        }
                    },
                    function(response) {
                        $log.error('Error: ' + JSON.stringify(response));
                        return $q.reject(response.data);
                    });
            },
            updateFinancialData: function(tester, id) {
                $log.debug(tester._id);
                return $http({
                    url: 'https://api.mongolab.com/api/1/databases/savings/collections/financialdata/' + id.$oid,
                    method: 'PUT',
                    data: {
                        financialData: dream
                    },
                    params: {
                        'apiKey': 'rLXW_SYqupDY0XvVv50ge8CVYUgrsMRZ'
                    }
                }).then(
                    function(response) {
                        if (typeof response.data === 'object') {
                            $log.info(response);
                            return response.data;
                        }
                        else {
                            $log.error('Error: ' + JSON.stringify(response));
                            return $q.reject(response.data);
                        }
                    },
                    function(response) {
                        $log.error('Error: ' + JSON.stringify(response));
                        return $q.reject(response.data);
                    });
            }
        };
    });