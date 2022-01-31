/*jshint -W069 */
/**
 *  ThingsBoard open-source IoT platform REST API documentation.
 * @class ThingsboardRestApi
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
var ThingsboardRestApi = (function(){
    'use strict';

    var request = require('request');
    var Q = require('q');
    var fileType = require('file-type');

    function ThingsboardRestApi(options){
        var domain = (typeof options === 'object') ? options.domain : options;
        this.domain = domain ? domain : 'https://demo.thingsboard.io:443';
        if(this.domain.length === 0) {
            throw new Error('Domain parameter must be specified as a string.');
        }
            this.token = (typeof options === 'object') ? (options.token ? options.token : {}) : {};
            this.apiKey = (typeof options === 'object') ? (options.apiKey ? options.apiKey : {}) : {};
    }

    function mergeQueryParams(parameters, queryParameters) {
        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                  .forEach(function(parameterName) {
                      var parameter = parameters.$queryParameters[parameterName];
                      queryParameters[parameterName] = parameter;
            });
        }
        return queryParameters;
    }

    /**
     * HTTP Request
     * @method
     * @name ThingsboardRestApi#request
     * @param {string} method - http method
     * @param {string} url - url to do request
     * @param {object} parameters
     * @param {object} body - body parameters / object
     * @param {object} headers - header parameters
     * @param {object} queryParameters - querystring parameters
     * @param {object} form - form data object
     * @param {object} deferred - promise object
     */
    ThingsboardRestApi.prototype.request = function(method, url, parameters, body, headers, queryParameters, form, deferred){
        var req = {
            method: method,
            uri: url,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        console.log("method: "+method)
        console.log("headers: "+headers)
        if(Object.keys(form).length > 0) {
            if (req.headers['Content-Type'] && req.headers['Content-Type'][0] === 'multipart/form-data') {
                delete req.body;
                var keyName = Object.keys(form)[0]
                req.formData = {
                    [keyName]: {
                        value: form[keyName],
                        options: {
                            filename: (fileType(form[keyName]) != null ? `file.${ fileType(form[keyName]).ext }` : `file` )
                        }
                    }
                };
            } else {
                req.form = form;
            }
        }
        if(typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body){
            if(error) {
                deferred.reject(error);
            } else {
                if(/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch(e) {}
                }
                if(response.statusCode === 204) {
                    deferred.resolve({ response: response });
                } else if(response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({ response: response, body: body });
                } else {
                    deferred.reject({ response: response, body: body });
                }
            }
        });
    };

           /**
            * Set Token
            * @method
            * @name SwaggerPetstore#setToken
            * @param {string} value - token's value
            * @param {string} headerOrQueryName - the header or query name to send the token at
            * @param {boolean} isQuery - true if send the token as query param, otherwise, send as header param
            */
            ThingsboardRestApi.prototype.setToken = function (value, headerOrQueryName, isQuery) {
                this.token.value = value;
                this.token.headerOrQueryName = headerOrQueryName;
                this.token.isQuery = isQuery;
                console.log("IN:setToken:: "+value)
            };
            /**
            * Set Api Key
            * @method
            * @name SwaggerPetstore#setApiKey
            * @param {string} value - apiKey's value
            * @param {string} headerOrQueryName - the header or query name to send the apiKey at
            * @param {boolean} isQuery - true if send the apiKey as query param, otherwise, send as header param
            */
            ThingsboardRestApi.prototype.setApiKey = function (value, headerOrQueryName, isQuery) {
                console.log("IN:setApiKey:: "+value)
                this.apiKey.value = value;
                this.apiKey.headerOrQueryName = headerOrQueryName;
                this.apiKey.isQuery = isQuery;
            };
        /**
        * Set Auth headers
        * @method
        * @name ThingsboardRestApi#setAuthHeaders
        * @param {object} headerParams - headers object
        */

        
        ThingsboardRestApi.prototype.setAuthHeaders = function (headerParams) {
            console.log("IN:lib:setAuthHeaders")
            var headers = headerParams ? headerParams : {};
            if (!this.token.isQuery) {
                if (this.token.headerOrQueryName) {
                    headers[this.token.headerOrQueryName] = this.token.value;
                } else if (this.token.value) {
                    console.log("IN:lib:setAuthHeaders:token")
                    headers['Authorization'] = 'Bearer ' + this.token.value;
                }
            }
            if (!this.apiKey.isQuery && this.apiKey.headerOrQueryName) {
                console.log("IN:lib:setAuthHeaders:apikey")
                //headers[this.apiKey.headerOrQueryName] = this.apiKey.value;
                headers['Authorization'] = 'Bearer ' + this.apiKey.value;
            }
            return headers;
        };
        
/**
 * Get the Security Settings object that contains password policy, etc.

Available for users with 'SYS_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getSecuritySettingsUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.getSecuritySettingsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/admin/securitySettings';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Updates the Security Settings object that contains password policy, etc.

Available for users with 'SYS_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#saveSecuritySettingsUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveSecuritySettingsUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/admin/securitySettings';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Creates or Updates the Administration Settings. Platform generates random Administration Settings Id during settings creation. The Administration Settings Id will be present in the response. Specify the Administration Settings Id when you would like to update the Administration Settings. Referencing non-existing Administration Settings Id will cause an error.

Available for users with 'SYS_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#saveAdminSettingsUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveAdminSettingsUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/admin/settings';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Attempts to send test email to the System Administrator User using Mail Settings provided as a parameter. You may change the 'To' email in the user profile of the System Administrator. 

Available for users with 'SYS_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#sendTestMailUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.sendTestMailUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/admin/settings/testMail';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Attempts to send test sms to the System Administrator User using SMS Settings and phone number provided as a parameters of the request. 

Available for users with 'SYS_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#sendTestSmsUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.sendTestSmsUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/admin/settings/testSms';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Get the Administration Settings object using specified string key. Referencing non-existing key will cause an error.

Available for users with 'SYS_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getAdminSettingsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.key - A string value of the key (e.g. 'general' or 'mail').
 */
 ThingsboardRestApi.prototype.getAdminSettingsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/admin/settings/{key}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{key}', parameters['key']);
        
        


        if(parameters['key'] === undefined){
            deferred.reject(new Error('Missing required  parameter: key'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Check notifications about new platform releases. 

Available for users with 'SYS_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#checkUpdatesUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.checkUpdatesUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/admin/updates';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Login method used to authenticate user and get JWT token data.

Value of the response **token** field can be used as **X-Authorization** header value:

`X-Authorization: Bearer $JWT_TOKEN_VALUE`.
 * @method
 * @name ThingsboardRestApi#loginPost
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.loginPost = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/auth/login';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Creates or Updates the Alarm. When creating alarm, platform generates Alarm Id as [time-based UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_1_(date-time_and_MAC_address)). The newly created Alarm id will be present in the response. Specify existing Alarm id to update the alarm. Referencing non-existing Alarm Id will cause 'Not Found' error. 

Platform also deduplicate the alarms based on the entity id of originator and alarm 'type'. For example, if the user or system component create the alarm with the type 'HighTemperature' for device 'Device A' the new active alarm is created. If the user tries to create 'HighTemperature' alarm for the same device again, the previous alarm will be updated (the 'end_ts' will be set to current timestamp). If the user clears the alarm (see 'Clear Alarm(clearAlarm)'), than new alarm with the same type and same device may be created. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#saveAlarmUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveAlarmUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/alarm';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Search the alarms by originator ('entityType' and entityId') and optional 'status' or 'searchStatus' filters and returns the highest AlarmSeverity(CRITICAL, MAJOR, MINOR, WARNING or INDETERMINATE). Specifying both parameters 'searchStatus' and 'status' at the same time will cause an error.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getHighestAlarmSeverityUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.entityId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.searchStatus - A string value representing one of the AlarmSearchStatus enumeration value
     * @param {string} parameters.status - A string value representing one of the AlarmStatus enumeration value
 */
 ThingsboardRestApi.prototype.getHighestAlarmSeverityUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/alarm/highestSeverity/{entityType}/{entityId}{?searchStatus,status}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{entityType}', parameters['entityType']);
        
        


        if(parameters['entityType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityType'));
            return deferred.promise;
        }
 
        
            path = path.replace('{entityId}', parameters['entityId']);
        
        


        if(parameters['entityId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityId'));
            return deferred.promise;
        }
 

                if(parameters['searchStatus'] !== undefined){
                    queryParameters['searchStatus'] = parameters['searchStatus'];
                }
        
        
        


 

                if(parameters['status'] !== undefined){
                    queryParameters['status'] = parameters['status'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the Alarm Info object based on the provided Alarm Id. If the user has the authority of 'Tenant Administrator', the server checks that the originator of alarm is owned by the same tenant. If the user has the authority of 'Customer User', the server checks that the originator of alarm belongs to the customer. Alarm Info is an extension of the default Alarm object that also contains name of the alarm originator.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getAlarmInfoByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.alarmId - A string value representing the alarm id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getAlarmInfoByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/alarm/info/{alarmId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{alarmId}', parameters['alarmId']);
        
        


        if(parameters['alarmId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: alarmId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the Alarm object based on the provided Alarm Id. If the user has the authority of 'Tenant Administrator', the server checks that the originator of alarm is owned by the same tenant. If the user has the authority of 'Customer User', the server checks that the originator of alarm belongs to the customer. 
 * @method
 * @name ThingsboardRestApi#getAlarmByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.alarmId - A string value representing the alarm id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getAlarmByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/alarm/{alarmId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{alarmId}', parameters['alarmId']);
        
        


        if(parameters['alarmId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: alarmId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Deletes the Alarm. Referencing non-existing Alarm Id will cause an error.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#deleteAlarmUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.alarmId - A string value representing the alarm id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.deleteAlarmUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/alarm/{alarmId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{alarmId}', parameters['alarmId']);
        
        


        if(parameters['alarmId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: alarmId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Acknowledge the Alarm. Once acknowledged, the 'ack_ts' field will be set to current timestamp and special rule chain event 'ALARM_ACK' will be generated. Referencing non-existing Alarm Id will cause an error.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#ackAlarmUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.alarmId - A string value representing the alarm id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.ackAlarmUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/alarm/{alarmId}/ack';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{alarmId}', parameters['alarmId']);
        
        


        if(parameters['alarmId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: alarmId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Clear the Alarm. Once cleared, the 'clear_ts' field will be set to current timestamp and special rule chain event 'ALARM_CLEAR' will be generated. Referencing non-existing Alarm Id will cause an error.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#clearAlarmUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.alarmId - A string value representing the alarm id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.clearAlarmUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/alarm/{alarmId}/clear';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{alarmId}', parameters['alarmId']);
        
        


        if(parameters['alarmId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: alarmId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of alarms for the selected entity. Specifying both parameters 'searchStatus' and 'status' at the same time will cause an error. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getAlarmsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.entityId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.searchStatus - A string value representing one of the AlarmSearchStatus enumeration value
     * @param {string} parameters.status - A string value representing one of the AlarmStatus enumeration value
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on of next alarm fields: type, severity or status
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
     * @param {integer} parameters.startTime - The start timestamp in milliseconds of the search time range over the Alarm class field: 'createdTime'.
     * @param {integer} parameters.endTime - The end timestamp in milliseconds of the search time range over the Alarm class field: 'createdTime'.
     * @param {boolean} parameters.fetchOriginator - A boolean value to specify if the alarm originator name will be filled in the AlarmInfo object  field: 'originatorName' or will returns as null.
 */
 ThingsboardRestApi.prototype.getAlarmsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/alarm/{entityType}/{entityId}{?endTime,fetchOriginator,page,pageSize,searchStatus,sortOrder,sortProperty,startTime,status,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{entityType}', parameters['entityType']);
        
        


        if(parameters['entityType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityType'));
            return deferred.promise;
        }
 
        
            path = path.replace('{entityId}', parameters['entityId']);
        
        


        if(parameters['entityId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityId'));
            return deferred.promise;
        }
 

                if(parameters['searchStatus'] !== undefined){
                    queryParameters['searchStatus'] = parameters['searchStatus'];
                }
        
        
        


 

                if(parameters['status'] !== undefined){
                    queryParameters['status'] = parameters['status'];
                }
        
        
        


 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 

                if(parameters['startTime'] !== undefined){
                    queryParameters['startTime'] = parameters['startTime'];
                }
        
        
        


 

                if(parameters['endTime'] !== undefined){
                    queryParameters['endTime'] = parameters['endTime'];
                }
        
        
        


 

                if(parameters['fetchOriginator'] !== undefined){
                    queryParameters['fetchOriginator'] = parameters['fetchOriginator'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of alarms that belongs to the current user owner. If the user has the authority of 'Tenant Administrator', the server returns alarms that belongs to the tenant of current user. If the user has the authority of 'Customer User', the server returns alarms that belongs to the customer of current user. Specifying both parameters 'searchStatus' and 'status' at the same time will cause an error. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getAllAlarmsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.searchStatus - A string value representing one of the AlarmSearchStatus enumeration value
     * @param {string} parameters.status - A string value representing one of the AlarmStatus enumeration value
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on of next alarm fields: type, severity or status
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
     * @param {integer} parameters.startTime - The start timestamp in milliseconds of the search time range over the Alarm class field: 'createdTime'.
     * @param {integer} parameters.endTime - The end timestamp in milliseconds of the search time range over the Alarm class field: 'createdTime'.
     * @param {boolean} parameters.fetchOriginator - A boolean value to specify if the alarm originator name will be filled in the AlarmInfo object  field: 'originatorName' or will returns as null.
 */
 ThingsboardRestApi.prototype.getAllAlarmsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/alarms{?endTime,fetchOriginator,page,pageSize,searchStatus,sortOrder,sortProperty,startTime,status,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['searchStatus'] !== undefined){
                    queryParameters['searchStatus'] = parameters['searchStatus'];
                }
        
        
        


 

                if(parameters['status'] !== undefined){
                    queryParameters['status'] = parameters['status'];
                }
        
        
        


 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 

                if(parameters['startTime'] !== undefined){
                    queryParameters['startTime'] = parameters['startTime'];
                }
        
        
        


 

                if(parameters['endTime'] !== undefined){
                    queryParameters['endTime'] = parameters['endTime'];
                }
        
        
        


 

                if(parameters['fetchOriginator'] !== undefined){
                    queryParameters['fetchOriginator'] = parameters['fetchOriginator'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Creates or Updates the Asset. When creating asset, platform generates Asset Id as [time-based UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_1_(date-time_and_MAC_address)). The newly created Asset id will be present in the response. Specify existing Asset id to update the asset. Referencing non-existing Asset Id will cause 'Not Found' error.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#saveAssetUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveAssetUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/asset';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * There's an ability to import the bulk of assets using the only .csv file.
 * @method
 * @name ThingsboardRestApi#processAssetsBulkImportUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.processAssetsBulkImportUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/asset/bulk_import';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the Asset Info object based on the provided Asset Id. If the user has the authority of 'Tenant Administrator', the server checks that the asset is owned by the same tenant. If the user has the authority of 'Customer User', the server checks that the asset is assigned to the same customer. Asset Info is an extension of the default Asset object that contains information about the assigned customer name. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getAssetInfoByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.assetId - A string value representing the asset id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getAssetInfoByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/asset/info/{assetId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{assetId}', parameters['assetId']);
        
        


        if(parameters['assetId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: assetId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a set of unique asset types based on assets that are either owned by the tenant or assigned to the customer which user is performing the request.
 * @method
 * @name ThingsboardRestApi#getAssetTypesUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.getAssetTypesUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/asset/types';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the Asset object based on the provided Asset Id. If the user has the authority of 'Tenant Administrator', the server checks that the asset is owned by the same tenant. If the user has the authority of 'Customer User', the server checks that the asset is assigned to the same customer.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getAssetByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.assetId - A string value representing the asset id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getAssetByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/asset/{assetId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{assetId}', parameters['assetId']);
        
        


        if(parameters['assetId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: assetId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Deletes the asset and all the relations (from and to the asset). Referencing non-existing asset Id will cause an error.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#deleteAssetUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.assetId - A string value representing the asset id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.deleteAssetUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/asset/{assetId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{assetId}', parameters['assetId']);
        
        


        if(parameters['assetId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: assetId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns all assets that are related to the specific entity. The entity id, relation type, asset types, depth of the search, and other query parameters defined using complex 'AssetSearchQuery' object. See 'Model' tab of the Parameters for more info.
 * @method
 * @name ThingsboardRestApi#findByQueryUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.findByQueryUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/assets';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Requested assets must be owned by tenant or assigned to customer which user is performing the request. 
 * @method
 * @name ThingsboardRestApi#getAssetsByIdsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.assetIds - A list of assets ids, separated by comma ','
 */
 ThingsboardRestApi.prototype.getAssetsByIdsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/assets{?assetIds}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['assetIds'] !== undefined){
                    queryParameters['assetIds'] = parameters['assetIds'];
                }
        
        
        


        if(parameters['assetIds'] === undefined){
            deferred.reject(new Error('Missing required  parameter: assetIds'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Clears assignment of the asset to customer. Customer will not be able to query asset afterwards.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#unassignAssetFromCustomerUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.assetId - A string value representing the asset id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.unassignAssetFromCustomerUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/asset/{assetId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{assetId}', parameters['assetId']);
        
        


        if(parameters['assetId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: assetId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Asset will be available for non-authorized (not logged-in) users. This is useful to create dashboards that you plan to share/embed on a publicly available website. However, users that are logged-in and belong to different tenant will not be able to access the asset.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#assignAssetToPublicCustomerUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.assetId - A string value representing the asset id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.assignAssetToPublicCustomerUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/public/asset/{assetId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{assetId}', parameters['assetId']);
        
        


        if(parameters['assetId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: assetId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Creates assignment of the asset to customer. Customer will be able to query asset afterwards.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#assignAssetToCustomerUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.customerId - A string value representing the customer id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.assetId - A string value representing the asset id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.assignAssetToCustomerUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/{customerId}/asset/{assetId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{customerId}', parameters['customerId']);
        
        


        if(parameters['customerId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: customerId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{assetId}', parameters['assetId']);
        
        


        if(parameters['assetId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: assetId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of assets info objects assigned to customer. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. Asset Info is an extension of the default Asset object that contains information about the assigned customer name. 
 * @method
 * @name ThingsboardRestApi#getCustomerAssetInfosUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.customerId - A string value representing the customer id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.type - Asset type
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the asset name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getCustomerAssetInfosUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/{customerId}/assetInfos{?page,pageSize,sortOrder,sortProperty,textSearch,type}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{customerId}', parameters['customerId']);
        
        


        if(parameters['customerId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: customerId'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['type'] !== undefined){
                    queryParameters['type'] = parameters['type'];
                }
        
        
        


 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of assets objects assigned to customer. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 
 * @method
 * @name ThingsboardRestApi#getCustomerAssetsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.customerId - A string value representing the customer id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.type - Asset type
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the asset name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getCustomerAssetsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/{customerId}/assets{?page,pageSize,sortOrder,sortProperty,textSearch,type}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{customerId}', parameters['customerId']);
        
        


        if(parameters['customerId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: customerId'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['type'] !== undefined){
                    queryParameters['type'] = parameters['type'];
                }
        
        
        


 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Creates assignment of an existing asset to an instance of The Edge. Assignment works in async way - first, notification event pushed to edge service queue on platform. Second, remote edge service will receive a copy of assignment asset (Edge will receive this instantly, if it's currently connected, or once it's going to be connected to platform). Third, once asset will be delivered to edge service, it's going to be available for usage on remote edge instance.
 * @method
 * @name ThingsboardRestApi#assignAssetToEdgeUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeId - A string value representing the edge id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.assetId - A string value representing the asset id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.assignAssetToEdgeUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge/{edgeId}/asset/{assetId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{assetId}', parameters['assetId']);
        
        


        if(parameters['assetId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: assetId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Clears assignment of the asset to the edge. Unassignment works in async way - first, 'unassign' notification event pushed to edge queue on platform. Second, remote edge service will receive an 'unassign' command to remove asset (Edge will receive this instantly, if it's currently connected, or once it's going to be connected to platform). Third, once 'unassign' command will be delivered to edge service, it's going to remove asset locally.
 * @method
 * @name ThingsboardRestApi#unassignAssetFromEdgeUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeId - A string value representing the edge id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.assetId - A string value representing the asset id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.unassignAssetFromEdgeUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge/{edgeId}/asset/{assetId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{assetId}', parameters['assetId']);
        
        


        if(parameters['assetId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: assetId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of assets assigned to edge. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 
 * @method
 * @name ThingsboardRestApi#getEdgeAssetsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeId - A string value representing the edge id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.type - Asset type
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the asset name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
     * @param {integer} parameters.startTime - Timestamp. Assets with creation time before it won't be queried
     * @param {integer} parameters.endTime - Timestamp. Assets with creation time after it won't be queried
 */
 ThingsboardRestApi.prototype.getEdgeAssetsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge/{edgeId}/assets{?endTime,page,pageSize,sortOrder,sortProperty,startTime,textSearch,type}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['type'] !== undefined){
                    queryParameters['type'] = parameters['type'];
                }
        
        
        


 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 

                if(parameters['startTime'] !== undefined){
                    queryParameters['startTime'] = parameters['startTime'];
                }
        
        
        


 

                if(parameters['endTime'] !== undefined){
                    queryParameters['endTime'] = parameters['endTime'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of assets info objects owned by tenant. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. Asset Info is an extension of the default Asset object that contains information about the assigned customer name. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantAssetInfosUsingGET
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.type - Asset type
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the asset name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getTenantAssetInfosUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenant/assetInfos{?page,pageSize,sortOrder,sortProperty,textSearch,type}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['type'] !== undefined){
                    queryParameters['type'] = parameters['type'];
                }
        
        
        


 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Requested asset must be owned by tenant that the user belongs to. Asset name is an unique property of asset. So it can be used to identify the asset.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantAssetUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.assetName - A string value representing the Asset name.
 */
 ThingsboardRestApi.prototype.getTenantAssetUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenant/assets{?assetName}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['assetName'] !== undefined){
                    queryParameters['assetName'] = parameters['assetName'];
                }
        
        
        


        if(parameters['assetName'] === undefined){
            deferred.reject(new Error('Missing required  parameter: assetName'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of assets owned by tenant. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantAssetsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.type - Asset type
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the asset name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getTenantAssetsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenant/assets{?page,pageSize,sortOrder,sortProperty,textSearch,type}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['type'] !== undefined){
                    queryParameters['type'] = parameters['type'];
                }
        
        
        


 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of audit logs related to the targeted customer entities (devices, assets, etc.), and users actions (login, logout, etc.) that belong to this customer. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getAuditLogsByCustomerIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.customerId - A string value representing the customer id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on one of the next properties: entityType, entityName, userName, actionType, actionStatus.
     * @param {string} parameters.sortProperty - Property of audit log to sort by. See the 'Model' tab of the Response Class for more details. Note: entityType sort property is not defined in the AuditLog class, however, it can be used to sort audit logs by types of entities that were logged.
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
     * @param {integer} parameters.startTime - The start timestamp in milliseconds of the search time range over the AuditLog class field: 'createdTime'.
     * @param {integer} parameters.endTime - The end timestamp in milliseconds of the search time range over the AuditLog class field: 'createdTime'.
     * @param {string} parameters.actionTypes - A String value representing comma-separated list of action types. This parameter is optional, but it can be used to filter results to fetch only audit logs of specific action types. For example, 'LOGIN', 'LOGOUT'. See the 'Model' tab of the Response Class for more details.
 */
 ThingsboardRestApi.prototype.getAuditLogsByCustomerIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/audit/logs/customer/{customerId}{?actionTypes,endTime,page,pageSize,sortOrder,sortProperty,startTime,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{customerId}', parameters['customerId']);
        
        


        if(parameters['customerId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: customerId'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 

                if(parameters['startTime'] !== undefined){
                    queryParameters['startTime'] = parameters['startTime'];
                }
        
        
        


 

                if(parameters['endTime'] !== undefined){
                    queryParameters['endTime'] = parameters['endTime'];
                }
        
        
        


 

                if(parameters['actionTypes'] !== undefined){
                    queryParameters['actionTypes'] = parameters['actionTypes'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of audit logs related to the actions on the targeted entity. Basically, this API call is used to get the full lifecycle of some specific entity. For example to see when a device was created, updated, assigned to some customer, or even deleted from the system. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getAuditLogsByEntityIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.entityId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on one of the next properties: entityType, entityName, userName, actionType, actionStatus.
     * @param {string} parameters.sortProperty - Property of audit log to sort by. See the 'Model' tab of the Response Class for more details. Note: entityType sort property is not defined in the AuditLog class, however, it can be used to sort audit logs by types of entities that were logged.
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
     * @param {integer} parameters.startTime - The start timestamp in milliseconds of the search time range over the AuditLog class field: 'createdTime'.
     * @param {integer} parameters.endTime - The end timestamp in milliseconds of the search time range over the AuditLog class field: 'createdTime'.
     * @param {string} parameters.actionTypes - A String value representing comma-separated list of action types. This parameter is optional, but it can be used to filter results to fetch only audit logs of specific action types. For example, 'LOGIN', 'LOGOUT'. See the 'Model' tab of the Response Class for more details.
 */
 ThingsboardRestApi.prototype.getAuditLogsByEntityIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/audit/logs/entity/{entityType}/{entityId}{?actionTypes,endTime,page,pageSize,sortOrder,sortProperty,startTime,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{entityType}', parameters['entityType']);
        
        


        if(parameters['entityType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityType'));
            return deferred.promise;
        }
 
        
            path = path.replace('{entityId}', parameters['entityId']);
        
        


        if(parameters['entityId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityId'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 

                if(parameters['startTime'] !== undefined){
                    queryParameters['startTime'] = parameters['startTime'];
                }
        
        
        


 

                if(parameters['endTime'] !== undefined){
                    queryParameters['endTime'] = parameters['endTime'];
                }
        
        
        


 

                if(parameters['actionTypes'] !== undefined){
                    queryParameters['actionTypes'] = parameters['actionTypes'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of audit logs related to the actions of targeted user. For example, RPC call to a particular device, or alarm acknowledgment for a specific device, etc. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getAuditLogsByUserIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.userId - A string value representing the user id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on one of the next properties: entityType, entityName, userName, actionType, actionStatus.
     * @param {string} parameters.sortProperty - Property of audit log to sort by. See the 'Model' tab of the Response Class for more details. Note: entityType sort property is not defined in the AuditLog class, however, it can be used to sort audit logs by types of entities that were logged.
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
     * @param {integer} parameters.startTime - The start timestamp in milliseconds of the search time range over the AuditLog class field: 'createdTime'.
     * @param {integer} parameters.endTime - The end timestamp in milliseconds of the search time range over the AuditLog class field: 'createdTime'.
     * @param {string} parameters.actionTypes - A String value representing comma-separated list of action types. This parameter is optional, but it can be used to filter results to fetch only audit logs of specific action types. For example, 'LOGIN', 'LOGOUT'. See the 'Model' tab of the Response Class for more details.
 */
 ThingsboardRestApi.prototype.getAuditLogsByUserIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/audit/logs/user/{userId}{?actionTypes,endTime,page,pageSize,sortOrder,sortProperty,startTime,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{userId}', parameters['userId']);
        
        


        if(parameters['userId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 

                if(parameters['startTime'] !== undefined){
                    queryParameters['startTime'] = parameters['startTime'];
                }
        
        
        


 

                if(parameters['endTime'] !== undefined){
                    queryParameters['endTime'] = parameters['endTime'];
                }
        
        
        


 

                if(parameters['actionTypes'] !== undefined){
                    queryParameters['actionTypes'] = parameters['actionTypes'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of audit logs related to all entities in the scope of the current user's Tenant. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getAuditLogsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on one of the next properties: entityType, entityName, userName, actionType, actionStatus.
     * @param {string} parameters.sortProperty - Property of audit log to sort by. See the 'Model' tab of the Response Class for more details. Note: entityType sort property is not defined in the AuditLog class, however, it can be used to sort audit logs by types of entities that were logged.
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
     * @param {integer} parameters.startTime - The start timestamp in milliseconds of the search time range over the AuditLog class field: 'createdTime'.
     * @param {integer} parameters.endTime - The end timestamp in milliseconds of the search time range over the AuditLog class field: 'createdTime'.
     * @param {string} parameters.actionTypes - A String value representing comma-separated list of action types. This parameter is optional, but it can be used to filter results to fetch only audit logs of specific action types. For example, 'LOGIN', 'LOGOUT'. See the 'Model' tab of the Response Class for more details.
 */
 ThingsboardRestApi.prototype.getAuditLogsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/audit/logs{?actionTypes,endTime,page,pageSize,sortOrder,sortProperty,startTime,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 

                if(parameters['startTime'] !== undefined){
                    queryParameters['startTime'] = parameters['startTime'];
                }
        
        
        


 

                if(parameters['endTime'] !== undefined){
                    queryParameters['endTime'] = parameters['endTime'];
                }
        
        
        


 

                if(parameters['actionTypes'] !== undefined){
                    queryParameters['actionTypes'] = parameters['actionTypes'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Change the password for the User which credentials are used to perform this REST API call. Be aware that previously generated [JWT](https://jwt.io/) tokens will be still valid until they expire.
 * @method
 * @name ThingsboardRestApi#changePasswordUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.changePasswordUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/auth/changePassword';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Special API call to record the 'logout' of the user to the Audit Logs. Since platform uses [JWT](https://jwt.io/), the actual logout is the procedure of clearing the [JWT](https://jwt.io/) token on the client side. 
 * @method
 * @name ThingsboardRestApi#logoutUsingPOST
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.logoutUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/auth/logout';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Get the information about the User which credentials are used to perform this REST API call.
 * @method
 * @name ThingsboardRestApi#getUserUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.getUserUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/auth/user';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Checks the activation token and forwards user to 'Create Password' page. If token is valid, returns '303 See Other' (redirect) response code with the correct address of 'Create Password' page and same 'activateToken' specified in the URL parameters. If token is not valid, returns '409 Conflict'.
 * @method
 * @name ThingsboardRestApi#checkActivateTokenUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.activateToken - The activate token string.
 */
 ThingsboardRestApi.prototype.checkActivateTokenUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/noauth/activate{?activateToken}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers['Accept'] = ['application/json'];


                if(parameters['activateToken'] !== undefined){
                    queryParameters['activateToken'] = parameters['activateToken'];
                }
        
        
        


        if(parameters['activateToken'] === undefined){
            deferred.reject(new Error('Missing required  parameter: activateToken'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Checks the activation token and updates corresponding user password in the database. Now the user may start using his password to login. The response already contains the [JWT](https://jwt.io) activation and refresh tokens, to simplify the user activation flow and avoid asking user to input password again after activation. If token is valid, returns the object that contains [JWT](https://jwt.io/) access and refresh tokens. If token is not valid, returns '404 Bad Request'.
 * @method
 * @name ThingsboardRestApi#activateUserUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {boolean} parameters.sendActivationMail - sendActivationMail
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.activateUserUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/noauth/activate{?sendActivationMail}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];


                if(parameters['sendActivationMail'] !== undefined){
                    queryParameters['sendActivationMail'] = parameters['sendActivationMail'];
                }
        
        
        


 
        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Checks the password reset token and updates the password. If token is valid, returns the object that contains [JWT](https://jwt.io/) access and refresh tokens. If token is not valid, returns '404 Bad Request'.
 * @method
 * @name ThingsboardRestApi#resetPasswordUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.resetPasswordUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/noauth/resetPassword';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Request to send the reset password email if the user with specified email address is present in the database. Always return '200 OK' status for security purposes.
 * @method
 * @name ThingsboardRestApi#requestResetPasswordByEmailUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.requestResetPasswordByEmailUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/noauth/resetPasswordByEmail';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Checks the password reset token and forwards user to 'Reset Password' page. If token is valid, returns '303 See Other' (redirect) response code with the correct address of 'Reset Password' page and same 'resetToken' specified in the URL parameters. If token is not valid, returns '409 Conflict'.
 * @method
 * @name ThingsboardRestApi#checkResetTokenUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.resetToken - The reset token string.
 */
 ThingsboardRestApi.prototype.checkResetTokenUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/noauth/resetPassword{?resetToken}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers['Accept'] = ['application/json'];


                if(parameters['resetToken'] !== undefined){
                    queryParameters['resetToken'] = parameters['resetToken'];
                }
        
        
        


        if(parameters['resetToken'] === undefined){
            deferred.reject(new Error('Missing required  parameter: resetToken'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * API call to get the password policy for the password validation form(s).
 * @method
 * @name ThingsboardRestApi#getUserPasswordPolicyUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.getUserPasswordPolicyUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/noauth/userPasswordPolicy';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Gets the Component Descriptor object using class name from the path parameters. Each Component Descriptor represents configuration of specific rule node (e.g. 'Save Timeseries' or 'Send Email'.). The Component Descriptors are used by the rule chain Web UI to build the configuration forms for the rule nodes. The Component Descriptors are discovered at runtime by scanning the class path and searching for @RuleNode annotation. Once discovered, the up to date list of descriptors is persisted to the database.

Available for users with 'SYS_ADMIN' or 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getComponentDescriptorByClazzUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.componentDescriptorClazz - Component Descriptor class name
 */
 ThingsboardRestApi.prototype.getComponentDescriptorByClazzUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/component/{componentDescriptorClazz}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{componentDescriptorClazz}', parameters['componentDescriptorClazz']);
        
        


        if(parameters['componentDescriptorClazz'] === undefined){
            deferred.reject(new Error('Missing required  parameter: componentDescriptorClazz'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Gets the Component Descriptors using rule node type and optional rule chain type request parameters. Each Component Descriptor represents configuration of specific rule node (e.g. 'Save Timeseries' or 'Send Email'.). The Component Descriptors are used by the rule chain Web UI to build the configuration forms for the rule nodes. The Component Descriptors are discovered at runtime by scanning the class path and searching for @RuleNode annotation. Once discovered, the up to date list of descriptors is persisted to the database.

Available for users with 'SYS_ADMIN' or 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getComponentDescriptorsByTypeUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.componentType - Type of the Rule Node
     * @param {string} parameters.ruleChainType - Type of the Rule Chain
 */
 ThingsboardRestApi.prototype.getComponentDescriptorsByTypeUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/components/{componentType}{?ruleChainType}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{componentType}', parameters['componentType']);
        
        


        if(parameters['componentType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: componentType'));
            return deferred.promise;
        }
 

                if(parameters['ruleChainType'] !== undefined){
                    queryParameters['ruleChainType'] = parameters['ruleChainType'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Gets the Component Descriptors using coma separated list of rule node types and optional rule chain type request parameters. Each Component Descriptor represents configuration of specific rule node (e.g. 'Save Timeseries' or 'Send Email'.). The Component Descriptors are used by the rule chain Web UI to build the configuration forms for the rule nodes. The Component Descriptors are discovered at runtime by scanning the class path and searching for @RuleNode annotation. Once discovered, the up to date list of descriptors is persisted to the database.

Available for users with 'SYS_ADMIN' or 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getComponentDescriptorsByTypesUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.componentTypes - List of types of the Rule Nodes, (ENRICHMENT, FILTER, TRANSFORMATION, ACTION or EXTERNAL)
     * @param {string} parameters.ruleChainType - Type of the Rule Chain
 */
 ThingsboardRestApi.prototype.getComponentDescriptorsByTypesUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/components{?componentTypes,ruleChainType}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['componentTypes'] !== undefined){
                    queryParameters['componentTypes'] = parameters['componentTypes'];
                }
        
        
        


        if(parameters['componentTypes'] === undefined){
            deferred.reject(new Error('Missing required  parameter: componentTypes'));
            return deferred.promise;
        }
 

                if(parameters['ruleChainType'] !== undefined){
                    queryParameters['ruleChainType'] = parameters['ruleChainType'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Creates or Updates the Customer. When creating customer, platform generates Customer Id as [time-based UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_1_(date-time_and_MAC_address)). The newly created Customer Id will be present in the response. Specify existing Customer Id to update the Customer. Referencing non-existing Customer Id will cause 'Not Found' error.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#saveCustomerUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveCustomerUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Get the Customer object based on the provided Customer Id. If the user has the authority of 'Tenant Administrator', the server checks that the customer is owned by the same tenant. If the user has the authority of 'Customer User', the server checks that the user belongs to the customer.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getCustomerByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.customerId - A string value representing the customer id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getCustomerByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/{customerId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{customerId}', parameters['customerId']);
        
        


        if(parameters['customerId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: customerId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Deletes the Customer and all customer Users. All assigned Dashboards, Assets, Devices, etc. will be unassigned but not deleted. Referencing non-existing Customer Id will cause an error.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#deleteCustomerUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.customerId - A string value representing the customer id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.deleteCustomerUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/{customerId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{customerId}', parameters['customerId']);
        
        


        if(parameters['customerId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: customerId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Get the short customer object that contains only the title and 'isPublic' flag. If the user has the authority of 'Tenant Administrator', the server checks that the customer is owned by the same tenant. If the user has the authority of 'Customer User', the server checks that the user belongs to the customer.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getShortCustomerInfoByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.customerId - A string value representing the customer id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getShortCustomerInfoByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/{customerId}/shortInfo';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{customerId}', parameters['customerId']);
        
        


        if(parameters['customerId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: customerId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Get the title of the customer. If the user has the authority of 'Tenant Administrator', the server checks that the customer is owned by the same tenant. If the user has the authority of 'Customer User', the server checks that the user belongs to the customer.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getCustomerTitleByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.customerId - A string value representing the customer id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getCustomerTitleByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/{customerId}/title';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{customerId}', parameters['customerId']);
        
        


        if(parameters['customerId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: customerId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of customers owned by tenant. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getCustomersUsingGET
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the customer title.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getCustomersUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customers{?page,pageSize,sortOrder,sortProperty,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Get the Customer using Customer Title. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantCustomerUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.customerTitle - A string value representing the Customer title.
 */
 ThingsboardRestApi.prototype.getTenantCustomerUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenant/customers{?customerTitle}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['customerTitle'] !== undefined){
                    queryParameters['customerTitle'] = parameters['customerTitle'];
                }
        
        
        


        if(parameters['customerTitle'] === undefined){
            deferred.reject(new Error('Missing required  parameter: customerTitle'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Assigns the dashboard to a special, auto-generated 'Public' Customer. Once assigned, unauthenticated users may browse the dashboard. This method is useful if you like to embed the dashboard on public web pages to be available for users that are not logged in. Be aware that making the dashboard public does not mean that it automatically makes all devices and assets you use in the dashboard to be public.Use [assign Asset to Public Customer](#!/asset-controller/assignAssetToPublicCustomerUsingPOST) and [assign Device to Public Customer](#!/device-controller/assignDeviceToPublicCustomerUsingPOST) for this purpose. Returns the Dashboard object.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#assignDashboardToPublicCustomerUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.dashboardId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.assignDashboardToPublicCustomerUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/public/dashboard/{dashboardId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{dashboardId}', parameters['dashboardId']);
        
        


        if(parameters['dashboardId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: dashboardId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Unassigns the dashboard from a special, auto-generated 'Public' Customer. Once unassigned, unauthenticated users may no longer browse the dashboard. Returns the Dashboard object.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#unassignDashboardFromPublicCustomerUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.dashboardId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.unassignDashboardFromPublicCustomerUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/public/dashboard/{dashboardId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{dashboardId}', parameters['dashboardId']);
        
        


        if(parameters['dashboardId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: dashboardId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Assign the Dashboard to specified Customer or do nothing if the Dashboard is already assigned to that Customer. Returns the Dashboard object.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#assignDashboardToCustomerUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.customerId - A string value representing the customer id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.dashboardId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.assignDashboardToCustomerUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/{customerId}/dashboard/{dashboardId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{customerId}', parameters['customerId']);
        
        


        if(parameters['customerId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: customerId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{dashboardId}', parameters['dashboardId']);
        
        


        if(parameters['dashboardId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: dashboardId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Unassign the Dashboard from specified Customer or do nothing if the Dashboard is already assigned to that Customer. Returns the Dashboard object.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#unassignDashboardFromCustomerUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.customerId - A string value representing the customer id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.dashboardId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.unassignDashboardFromCustomerUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/{customerId}/dashboard/{dashboardId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{customerId}', parameters['customerId']);
        
        


        if(parameters['customerId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: customerId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{dashboardId}', parameters['dashboardId']);
        
        


        if(parameters['dashboardId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: dashboardId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of dashboard info objects owned by the specified customer. The Dashboard Info object contains lightweight information about the dashboard (e.g. title, image, assigned customers) but does not contain the heavyweight configuration JSON. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getCustomerDashboardsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.customerId - A string value representing the customer id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {boolean} parameters.mobile - Exclude dashboards that are hidden for mobile
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the dashboard title.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getCustomerDashboardsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/{customerId}/dashboards{?mobile,page,pageSize,sortOrder,sortProperty,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{customerId}', parameters['customerId']);
        
        


        if(parameters['customerId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: customerId'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['mobile'] !== undefined){
                    queryParameters['mobile'] = parameters['mobile'];
                }
        
        
        


 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Create or update the Dashboard. When creating dashboard, platform generates Dashboard Id as [time-based UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_1_(date-time_and_MAC_address)). The newly created Dashboard id will be present in the response. Specify existing Dashboard id to update the dashboard. Referencing non-existing dashboard Id will cause 'Not Found' error. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#saveDashboardUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveDashboardUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/dashboard';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns the home dashboard object that is configured as 'homeDashboardId' parameter in the 'additionalInfo' of the User. If 'homeDashboardId' parameter is not set on the User level and the User has authority 'CUSTOMER_USER', check the same parameter for the corresponding Customer. If 'homeDashboardId' parameter is not set on the User and Customer levels then checks the same parameter for the Tenant that owns the user. The Dashboard object is a heavyweight object that contains information about the dashboard (e.g. title, image, assigned customers) and also configuration JSON (e.g. layouts, widgets, entity aliases).

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getHomeDashboardUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.getHomeDashboardUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/dashboard/home';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns the home dashboard info object that is configured as 'homeDashboardId' parameter in the 'additionalInfo' of the User. If 'homeDashboardId' parameter is not set on the User level and the User has authority 'CUSTOMER_USER', check the same parameter for the corresponding Customer. If 'homeDashboardId' parameter is not set on the User and Customer levels then checks the same parameter for the Tenant that owns the user. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getHomeDashboardInfoUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.getHomeDashboardInfoUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/dashboard/home/info';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Get the information about the dashboard based on 'dashboardId' parameter. The Dashboard Info object contains lightweight information about the dashboard (e.g. title, image, assigned customers) but does not contain the heavyweight configuration JSON.
 * @method
 * @name ThingsboardRestApi#getDashboardInfoByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.dashboardId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getDashboardInfoByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/dashboard/info/{dashboardId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{dashboardId}', parameters['dashboardId']);
        
        


        if(parameters['dashboardId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: dashboardId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Get the maximum number of data points that dashboard may request from the server per in a single subscription command. This value impacts the time window behavior. It impacts 'Max values' parameter in case user selects 'None' as 'Data aggregation function'. It also impacts the 'Grouping interval' in case of any other 'Data aggregation function' is selected. The actual value of the limit is configurable in the system configuration file.
 * @method
 * @name ThingsboardRestApi#getMaxDatapointsLimitUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.getMaxDatapointsLimitUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/dashboard/maxDatapointsLimit';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Get the server time (milliseconds since January 1, 1970 UTC). Used to adjust view of the dashboards according to the difference between browser and server time.
 * @method
 * @name ThingsboardRestApi#getServerTimeUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.getServerTimeUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/dashboard/serverTime';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Get the dashboard based on 'dashboardId' parameter. The Dashboard object is a heavyweight object that contains information about the dashboard (e.g. title, image, assigned customers) and also configuration JSON (e.g. layouts, widgets, entity aliases).

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getDashboardByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.dashboardId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getDashboardByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/dashboard/{dashboardId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{dashboardId}', parameters['dashboardId']);
        
        


        if(parameters['dashboardId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: dashboardId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Delete the Dashboard.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#deleteDashboardUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.dashboardId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.deleteDashboardUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/dashboard/{dashboardId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{dashboardId}', parameters['dashboardId']);
        
        


        if(parameters['dashboardId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: dashboardId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Updates the list of Customers that this Dashboard is assigned to. Removes previous assignments to customers that are not in the provided list. Returns the Dashboard object. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#updateDashboardCustomersUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.dashboardId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.updateDashboardCustomersUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/dashboard/{dashboardId}/customers';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
            path = path.replace('{dashboardId}', parameters['dashboardId']);
        
        


        if(parameters['dashboardId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: dashboardId'));
            return deferred.promise;
        }
 
        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Adds the list of Customers to the existing list of assignments for the Dashboard. Keeps previous assignments to customers that are not in the provided list. Returns the Dashboard object.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#addDashboardCustomersUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.dashboardId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.addDashboardCustomersUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/dashboard/{dashboardId}/customers/add';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
            path = path.replace('{dashboardId}', parameters['dashboardId']);
        
        


        if(parameters['dashboardId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: dashboardId'));
            return deferred.promise;
        }
 
        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Removes the list of Customers from the existing list of assignments for the Dashboard. Keeps other assignments to customers that are not in the provided list. Returns the Dashboard object.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#removeDashboardCustomersUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.dashboardId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.removeDashboardCustomersUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/dashboard/{dashboardId}/customers/remove';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
            path = path.replace('{dashboardId}', parameters['dashboardId']);
        
        


        if(parameters['dashboardId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: dashboardId'));
            return deferred.promise;
        }
 
        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Creates assignment of an existing dashboard to an instance of The Edge. Assignment works in async way - first, notification event pushed to edge service queue on platform. Second, remote edge service will receive a copy of assignment dashboard (Edge will receive this instantly, if it's currently connected, or once it's going to be connected to platform). Third, once dashboard will be delivered to edge service, it's going to be available for usage on remote edge instance.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#assignDashboardToEdgeUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeId - edgeId
     * @param {string} parameters.dashboardId - dashboardId
 */
 ThingsboardRestApi.prototype.assignDashboardToEdgeUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge/{edgeId}/dashboard/{dashboardId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{dashboardId}', parameters['dashboardId']);
        
        


        if(parameters['dashboardId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: dashboardId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Clears assignment of the dashboard to the edge. Unassignment works in async way - first, 'unassign' notification event pushed to edge queue on platform. Second, remote edge service will receive an 'unassign' command to remove dashboard (Edge will receive this instantly, if it's currently connected, or once it's going to be connected to platform). Third, once 'unassign' command will be delivered to edge service, it's going to remove dashboard locally.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#unassignDashboardFromEdgeUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeId - edgeId
     * @param {string} parameters.dashboardId - dashboardId
 */
 ThingsboardRestApi.prototype.unassignDashboardFromEdgeUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge/{edgeId}/dashboard/{dashboardId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{dashboardId}', parameters['dashboardId']);
        
        


        if(parameters['dashboardId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: dashboardId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of dashboard info objects assigned to the specified edge. The Dashboard Info object contains lightweight information about the dashboard (e.g. title, image, assigned customers) but does not contain the heavyweight configuration JSON. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getEdgeDashboardsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeId - A string value representing the edge id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the dashboard title.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getEdgeDashboardsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge/{edgeId}/dashboards{?page,pageSize,sortOrder,sortProperty,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns the home dashboard info object that is configured as 'homeDashboardId' parameter in the 'additionalInfo' of the corresponding tenant. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantHomeDashboardInfoUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.getTenantHomeDashboardInfoUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenant/dashboard/home/info';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Update the home dashboard assignment for the current tenant. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#setTenantHomeDashboardInfoUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.setTenantHomeDashboardInfoUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenant/dashboard/home/info';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of dashboard info objects owned by the tenant of a current user. The Dashboard Info object contains lightweight information about the dashboard (e.g. title, image, assigned customers) but does not contain the heavyweight configuration JSON. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantDashboardsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {boolean} parameters.mobile - Exclude dashboards that are hidden for mobile
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the dashboard title.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getTenantDashboardsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenant/dashboards{?mobile,page,pageSize,sortOrder,sortProperty,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['mobile'] !== undefined){
                    queryParameters['mobile'] = parameters['mobile'];
                }
        
        
        


 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of dashboard info objects owned by tenant. The Dashboard Info object contains lightweight information about the dashboard (e.g. title, image, assigned customers) but does not contain the heavyweight configuration JSON. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'SYS_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantDashboardsUsingGET_1
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.tenantId - A string value representing the tenant id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the dashboard title.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getTenantDashboardsUsingGET_1 = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenant/{tenantId}/dashboards{?page,pageSize,sortOrder,sortProperty,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{tenantId}', parameters['tenantId']);
        
        


        if(parameters['tenantId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Clears assignment of the device to customer. Customer will not be able to query device afterwards.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#unassignDeviceFromCustomerUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.deviceId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.unassignDeviceFromCustomerUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/device/{deviceId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{deviceId}', parameters['deviceId']);
        
        


        if(parameters['deviceId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Claiming makes it possible to assign a device to the specific customer using device/server side claiming data (in the form of secret key).To make this happen you have to provide unique device name and optional claiming data (it is needed only for device-side claiming).Once device is claimed, the customer becomes its owner and customer users may access device data as well as control the device. 
In order to enable claiming devices feature a system parameter security.claim.allowClaimingByDefault should be set to true, otherwise a server-side claimingAllowed attribute with the value true is obligatory for provisioned devices. 
See official documentation for more details regarding claiming.

Available for users with 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#claimDeviceUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.deviceName - Unique name of the device which is going to be claimed
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.claimDeviceUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/device/{deviceName}/claim';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
            path = path.replace('{deviceName}', parameters['deviceName']);
        
        


        if(parameters['deviceName'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceName'));
            return deferred.promise;
        }
 
        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Reclaiming means the device will be unassigned from the customer and the device will be available for claiming again.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#reClaimDeviceUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.deviceName - Unique name of the device which is going to be reclaimed
 */
 ThingsboardRestApi.prototype.reClaimDeviceUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/device/{deviceName}/claim';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{deviceName}', parameters['deviceName']);
        
        


        if(parameters['deviceName'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceName'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Device will be available for non-authorized (not logged-in) users. This is useful to create dashboards that you plan to share/embed on a publicly available website. However, users that are logged-in and belong to different tenant will not be able to access the device.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#assignDeviceToPublicCustomerUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.deviceId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.assignDeviceToPublicCustomerUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/public/device/{deviceId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{deviceId}', parameters['deviceId']);
        
        


        if(parameters['deviceId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Creates assignment of the device to customer. Customer will be able to query device afterwards.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#assignDeviceToCustomerUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.customerId - A string value representing the customer id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.deviceId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.assignDeviceToCustomerUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/{customerId}/device/{deviceId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{customerId}', parameters['customerId']);
        
        


        if(parameters['customerId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: customerId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{deviceId}', parameters['deviceId']);
        
        


        if(parameters['deviceId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of devices info objects assigned to customer. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. Device Info is an extension of the default Device object that contains information about the assigned customer name and device profile name. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getCustomerDeviceInfosUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.customerId - A string value representing the customer id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.type - Device type as the name of the device profile
     * @param {string} parameters.deviceProfileId - A string value representing the device profile id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the device name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getCustomerDeviceInfosUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/{customerId}/deviceInfos{?deviceProfileId,page,pageSize,sortOrder,sortProperty,textSearch,type}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{customerId}', parameters['customerId']);
        
        


        if(parameters['customerId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: customerId'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['type'] !== undefined){
                    queryParameters['type'] = parameters['type'];
                }
        
        
        


 

                if(parameters['deviceProfileId'] !== undefined){
                    queryParameters['deviceProfileId'] = parameters['deviceProfileId'];
                }
        
        
        


 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of devices objects assigned to customer. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getCustomerDevicesUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.customerId - A string value representing the customer id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.type - Device type as the name of the device profile
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the device name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getCustomerDevicesUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/{customerId}/devices{?page,pageSize,sortOrder,sortProperty,textSearch,type}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{customerId}', parameters['customerId']);
        
        


        if(parameters['customerId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: customerId'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['type'] !== undefined){
                    queryParameters['type'] = parameters['type'];
                }
        
        
        


 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Create or update the Device. When creating device, platform generates Device Id as [time-based UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_1_(date-time_and_MAC_address)). Requires to provide the Device Credentials object as well. Useful to create device and credentials in one request. You may find the example of LwM2M device and RPK credentials below: 

```json
{
  "device": {
    "name": "LwRpk00000000",
    "type": "lwm2mProfileRpk"
  },
  "credentials": {
    "id": "null",
    "createdTime": 0,
    "deviceId": "null",
    "credentialsType": "LWM2M_CREDENTIALS",
    "credentialsId": "LwRpk00000000",
    "credentialsValue": {
      "client": {
        "endpoint": "LwRpk00000000",
        "securityConfigClientMode": "RPK",
        "key": "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEUEBxNl/RcYJNm8mk91CyVXoIJiROYDlXcSSqK6e5bDHwOW4ZiN2lNnXalyF0Jxw8MbAytnDMERXyAja5VEMeVQ=="
      },
      "bootstrap": {
        "bootstrapServer": {
          "securityMode": "RPK",
          "clientPublicKeyOrId": "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEUEBxNl/RcYJNm8mk91CyVXoIJiROYDlXcSSqK6e5bDHwOW4ZiN2lNnXalyF0Jxw8MbAytnDMERXyAja5VEMeVQ==",
          "clientSecretKey": "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgd9GAx7yZW37autew5KZykn4IgRpge/tZSjnudnZJnMahRANCAARQQHE2X9Fxgk2byaT3ULJVeggmJE5gOVdxJKorp7lsMfA5bhmI3aU2ddqXIXQnHDwxsDK2cMwRFfICNrlUQx5V"
        },
        "lwm2mServer": {
          "securityMode": "RPK",
          "clientPublicKeyOrId": "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEUEBxNl/RcYJNm8mk91CyVXoIJiROYDlXcSSqK6e5bDHwOW4ZiN2lNnXalyF0Jxw8MbAytnDMERXyAja5VEMeVQ==",
          "clientSecretKey": "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgd9GAx7yZW37autew5KZykn4IgRpge/tZSjnudnZJnMahRANCAARQQHE2X9Fxgk2byaT3ULJVeggmJE5gOVdxJKorp7lsMfA5bhmI3aU2ddqXIXQnHDwxsDK2cMwRFfICNrlUQx5V"
        }
      }
    }
  }
}
```

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#saveDeviceWithCredentialsUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveDeviceWithCredentialsUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/device-with-credentials';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * There's an ability to import the bulk of devices using the only .csv file.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#processDevicesBulkImportUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.processDevicesBulkImportUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/device/bulk_import';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * During device creation, platform generates random 'ACCESS_TOKEN' credentials. Use this method to update the device credentials. First use 'getDeviceCredentialsByDeviceId' to get the credentials id and value. Then use current method to update the credentials type and value. It is not possible to create multiple device credentials for the same device. The structure of device credentials id and value is simple for the 'ACCESS_TOKEN' but is much more complex for the 'MQTT_BASIC' or 'LWM2M_CREDENTIALS'.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#updateDeviceCredentialsUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.updateDeviceCredentialsUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/device/credentials';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the Device Info object based on the provided Device Id. If the user has the authority of 'Tenant Administrator', the server checks that the device is owned by the same tenant. If the user has the authority of 'Customer User', the server checks that the device is assigned to the same customer. Device Info is an extension of the default Device object that contains information about the assigned customer name and device profile name. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getDeviceInfoByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.deviceId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getDeviceInfoByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/device/info/{deviceId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{deviceId}', parameters['deviceId']);
        
        


        if(parameters['deviceId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a set of unique device profile names based on devices that are either owned by the tenant or assigned to the customer which user is performing the request.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getDeviceTypesUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.getDeviceTypesUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/device/types';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the Device object based on the provided Device Id. If the user has the authority of 'TENANT_ADMIN', the server checks that the device is owned by the same tenant. If the user has the authority of 'CUSTOMER_USER', the server checks that the device is assigned to the same customer.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getDeviceByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.deviceId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getDeviceByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/device/{deviceId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{deviceId}', parameters['deviceId']);
        
        


        if(parameters['deviceId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Deletes the device, it's credentials and all the relations (from and to the device). Referencing non-existing device Id will cause an error.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#deleteDeviceUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.deviceId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.deleteDeviceUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/device/{deviceId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{deviceId}', parameters['deviceId']);
        
        


        if(parameters['deviceId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * If during device creation there wasn't specified any credentials, platform generates random 'ACCESS_TOKEN' credentials.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getDeviceCredentialsByDeviceIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.deviceId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getDeviceCredentialsByDeviceIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/device/{deviceId}/credentials';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{deviceId}', parameters['deviceId']);
        
        


        if(parameters['deviceId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns all devices that are related to the specific entity. The entity id, relation type, device types, depth of the search, and other query parameters defined using complex 'DeviceSearchQuery' object. See 'Model' tab of the Parameters for more info.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#findByQueryUsingPOST_1
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.findByQueryUsingPOST_1 = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/devices';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * The platform gives an ability to load OTA (over-the-air) packages to devices. It can be done in two different ways: device scope or device profile scope.In the response you will find the number of devices with specified device profile, but without previously defined device scope OTA package. It can be useful when you want to define number of devices that will be affected with future OTA package

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#countByDeviceProfileAndEmptyOtaPackageUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.otaPackageType - OTA package type
     * @param {string} parameters.deviceProfileId - Device Profile Id. I.g. '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.countByDeviceProfileAndEmptyOtaPackageUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/devices/count/{otaPackageType}/{deviceProfileId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{otaPackageType}', parameters['otaPackageType']);
        
        


        if(parameters['otaPackageType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: otaPackageType'));
            return deferred.promise;
        }
 
        
            path = path.replace('{deviceProfileId}', parameters['deviceProfileId']);
        
        


        if(parameters['deviceProfileId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceProfileId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Requested devices must be owned by tenant or assigned to customer which user is performing the request. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getDevicesByIdsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.deviceIds - A list of devices ids, separated by comma ','
 */
 ThingsboardRestApi.prototype.getDevicesByIdsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/devices{?deviceIds}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['deviceIds'] !== undefined){
                    queryParameters['deviceIds'] = parameters['deviceIds'];
                }
        
        
        


        if(parameters['deviceIds'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceIds'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Create or update the Device. When creating device, platform generates Device Id as [time-based UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_1_(date-time_and_MAC_address)). Device credentials are also generated if not provided in the 'accessToken' request parameter. The newly created device id will be present in the response. Specify existing Device id to update the device. Referencing non-existing device Id will cause 'Not Found' error.

Device name is unique in the scope of tenant. Use unique identifiers like MAC or IMEI for the device names and non-unique 'label' field for user-friendly visualization purposes.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#saveDeviceUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.accessToken - Optional value of the device credentials to be used during device creation. If omitted, access token will be auto-generated.
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveDeviceUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/device{?accessToken}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];


                if(parameters['accessToken'] !== undefined){
                    queryParameters['accessToken'] = parameters['accessToken'];
                }
        
        
        


 
        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Creates assignment of an existing device to an instance of The Edge. Assignment works in async way - first, notification event pushed to edge service queue on platform. Second, remote edge service will receive a copy of assignment device (Edge will receive this instantly, if it's currently connected, or once it's going to be connected to platform). Third, once device will be delivered to edge service, it's going to be available for usage on remote edge instance.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#assignDeviceToEdgeUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeId - A string value representing the edge id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.deviceId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.assignDeviceToEdgeUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge/{edgeId}/device/{deviceId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{deviceId}', parameters['deviceId']);
        
        


        if(parameters['deviceId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Clears assignment of the device to the edge. Unassignment works in async way - first, 'unassign' notification event pushed to edge queue on platform. Second, remote edge service will receive an 'unassign' command to remove device (Edge will receive this instantly, if it's currently connected, or once it's going to be connected to platform). Third, once 'unassign' command will be delivered to edge service, it's going to remove device locally.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#unassignDeviceFromEdgeUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeId - A string value representing the edge id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.deviceId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.unassignDeviceFromEdgeUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge/{edgeId}/device/{deviceId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{deviceId}', parameters['deviceId']);
        
        


        if(parameters['deviceId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of devices assigned to edge. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getEdgeDevicesUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeId - A string value representing the edge id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.type - Device type as the name of the device profile
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the device name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
     * @param {integer} parameters.startTime - Timestamp. Devices with creation time before it won't be queried
     * @param {integer} parameters.endTime - Timestamp. Devices with creation time after it won't be queried
 */
 ThingsboardRestApi.prototype.getEdgeDevicesUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge/{edgeId}/devices{?endTime,page,pageSize,sortOrder,sortProperty,startTime,textSearch,type}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['type'] !== undefined){
                    queryParameters['type'] = parameters['type'];
                }
        
        
        


 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 

                if(parameters['startTime'] !== undefined){
                    queryParameters['startTime'] = parameters['startTime'];
                }
        
        
        


 

                if(parameters['endTime'] !== undefined){
                    queryParameters['endTime'] = parameters['endTime'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of devices info objects owned by tenant. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. Device Info is an extension of the default Device object that contains information about the assigned customer name and device profile name. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantDeviceInfosUsingGET
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.type - Device type as the name of the device profile
     * @param {string} parameters.deviceProfileId - A string value representing the device profile id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the device name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getTenantDeviceInfosUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenant/deviceInfos{?deviceProfileId,page,pageSize,sortOrder,sortProperty,textSearch,type}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['type'] !== undefined){
                    queryParameters['type'] = parameters['type'];
                }
        
        
        


 

                if(parameters['deviceProfileId'] !== undefined){
                    queryParameters['deviceProfileId'] = parameters['deviceProfileId'];
                }
        
        
        


 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Requested device must be owned by tenant that the user belongs to. Device name is an unique property of device. So it can be used to identify the device.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantDeviceUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.deviceName - A string value representing the Device name.
 */
 ThingsboardRestApi.prototype.getTenantDeviceUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenant/devices{?deviceName}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['deviceName'] !== undefined){
                    queryParameters['deviceName'] = parameters['deviceName'];
                }
        
        
        


        if(parameters['deviceName'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceName'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of devices owned by tenant. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantDevicesUsingGET
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.type - Device type as the name of the device profile
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the device name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getTenantDevicesUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenant/devices{?page,pageSize,sortOrder,sortProperty,textSearch,type}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['type'] !== undefined){
                    queryParameters['type'] = parameters['type'];
                }
        
        
        


 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Creates assignment of the device to tenant. Thereafter tenant will be able to reassign the device to a customer.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#assignDeviceToTenantUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.tenantId - A string value representing the tenant id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.deviceId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.assignDeviceToTenantUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenant/{tenantId}/device/{deviceId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{tenantId}', parameters['tenantId']);
        
        


        if(parameters['tenantId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{deviceId}', parameters['deviceId']);
        
        


        if(parameters['deviceId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Create or update the Device Profile. When creating device profile, platform generates device profile id as [time-based UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_1_(date-time_and_MAC_address)). The newly created device profile id will be present in the response. Specify existing device profile id to update the device profile. Referencing non-existing device profile Id will cause 'Not Found' error. 

Device profile name is unique in the scope of tenant. Only one 'default' device profile may exist in scope of tenant.

# Device profile data definition

Device profile data object contains alarm rules configuration, device provision strategy and transport type configuration for device connectivity. Let's review some examples. First one is the default device profile data configuration and second one - the custom one. 

```json
{
   "alarms":[
   ],
   "configuration":{
      "type":"DEFAULT"
   },
   "provisionConfiguration":{
      "type":"DISABLED",
      "provisionDeviceSecret":null
   },
   "transportConfiguration":{
      "type":"DEFAULT"
   }
}
```

```json
{
   "alarms":[
      {
         "id":"2492b935-1226-59e9-8615-17d8978a4f93",
         "alarmType":"Temperature Alarm",
         "clearRule":{
            "schedule":null,
            "condition":{
               "spec":{
                  "type":"SIMPLE"
               },
               "condition":[
                  {
                     "key":{
                        "key":"temperature",
                        "type":"TIME_SERIES"
                     },
                     "value":null,
                     "predicate":{
                        "type":"NUMERIC",
                        "value":{
                           "userValue":null,
                           "defaultValue":30.0,
                           "dynamicValue":null
                        },
                        "operation":"LESS"
                     },
                     "valueType":"NUMERIC"
                  }
               ]
            },
            "dashboardId":null,
            "alarmDetails":null
         },
         "propagate":false,
         "createRules":{
            "MAJOR":{
               "schedule":{
                  "type":"SPECIFIC_TIME",
                  "endsOn":64800000,
                  "startsOn":43200000,
                  "timezone":"Europe/Kiev",
                  "daysOfWeek":[
                     1,
                     3,
                     5
                  ]
               },
               "condition":{
                  "spec":{
                     "type":"DURATION",
                     "unit":"MINUTES",
                     "predicate":{
                        "userValue":null,
                        "defaultValue":30,
                        "dynamicValue":null
                     }
                  },
                  "condition":[
                     {
                        "key":{
                           "key":"temperature",
                           "type":"TIME_SERIES"
                        },
                        "value":null,
                        "predicate":{
                           "type":"COMPLEX",
                           "operation":"OR",
                           "predicates":[
                              {
                                 "type":"NUMERIC",
                                 "value":{
                                    "userValue":null,
                                    "defaultValue":50.0,
                                    "dynamicValue":null
                                 },
                                 "operation":"LESS_OR_EQUAL"
                              },
                              {
                                 "type":"NUMERIC",
                                 "value":{
                                    "userValue":null,
                                    "defaultValue":30.0,
                                    "dynamicValue":null
                                 },
                                 "operation":"GREATER"
                              }
                           ]
                        },
                        "valueType":"NUMERIC"
                     }
                  ]
               },
               "dashboardId":null,
               "alarmDetails":null
            },
            "WARNING":{
               "schedule":{
                  "type":"CUSTOM",
                  "items":[
                     {
                        "endsOn":0,
                        "enabled":false,
                        "startsOn":0,
                        "dayOfWeek":1
                     },
                     {
                        "endsOn":64800000,
                        "enabled":true,
                        "startsOn":43200000,
                        "dayOfWeek":2
                     },
                     {
                        "endsOn":0,
                        "enabled":false,
                        "startsOn":0,
                        "dayOfWeek":3
                     },
                     {
                        "endsOn":57600000,
                        "enabled":true,
                        "startsOn":36000000,
                        "dayOfWeek":4
                     },
                     {
                        "endsOn":0,
                        "enabled":false,
                        "startsOn":0,
                        "dayOfWeek":5
                     },
                     {
                        "endsOn":0,
                        "enabled":false,
                        "startsOn":0,
                        "dayOfWeek":6
                     },
                     {
                        "endsOn":0,
                        "enabled":false,
                        "startsOn":0,
                        "dayOfWeek":7
                     }
                  ],
                  "timezone":"Europe/Kiev"
               },
               "condition":{
                  "spec":{
                     "type":"REPEATING",
                     "predicate":{
                        "userValue":null,
                        "defaultValue":5,
                        "dynamicValue":null
                     }
                  },
                  "condition":[
                     {
                        "key":{
                           "key":"tempConstant",
                           "type":"CONSTANT"
                        },
                        "value":30,
                        "predicate":{
                           "type":"NUMERIC",
                           "value":{
                              "userValue":null,
                              "defaultValue":0.0,
                              "dynamicValue":{
                                 "inherit":false,
                                 "sourceType":"CURRENT_DEVICE",
                                 "sourceAttribute":"tempThreshold"
                              }
                           },
                           "operation":"EQUAL"
                        },
                        "valueType":"NUMERIC"
                     }
                  ]
               },
               "dashboardId":null,
               "alarmDetails":null
            },
            "CRITICAL":{
               "schedule":null,
               "condition":{
                  "spec":{
                     "type":"SIMPLE"
                  },
                  "condition":[
                     {
                        "key":{
                           "key":"temperature",
                           "type":"TIME_SERIES"
                        },
                        "value":null,
                        "predicate":{
                           "type":"NUMERIC",
                           "value":{
                              "userValue":null,
                              "defaultValue":50.0,
                              "dynamicValue":null
                           },
                           "operation":"GREATER"
                        },
                        "valueType":"NUMERIC"
                     }
                  ]
               },
               "dashboardId":null,
               "alarmDetails":null
            }
         },
         "propagateRelationTypes":null
      }
   ],
   "configuration":{
      "type":"DEFAULT"
   },
   "provisionConfiguration":{
      "type":"ALLOW_CREATE_NEW_DEVICES",
      "provisionDeviceSecret":"vaxb9hzqdbz3oqukvomg"
   },
   "transportConfiguration":{
      "type":"MQTT",
      "deviceTelemetryTopic":"v1/devices/me/telemetry",
      "deviceAttributesTopic":"v1/devices/me/attributes",
      "transportPayloadTypeConfiguration":{
         "transportPayloadType":"PROTOBUF",
         "deviceTelemetryProtoSchema":"syntax =\"proto3\";\npackage telemetry;\n\nmessage SensorDataReading {\n\n  optional double temperature = 1;\n  optional double humidity = 2;\n  InnerObject innerObject = 3;\n\n  message InnerObject {\n    optional string key1 = 1;\n    optional bool key2 = 2;\n    optional double key3 = 3;\n    optional int32 key4 = 4;\n    optional string key5 = 5;\n  }\n}",
         "deviceAttributesProtoSchema":"syntax =\"proto3\";\npackage attributes;\n\nmessage SensorConfiguration {\n  optional string firmwareVersion = 1;\n  optional string serialNumber = 2;\n}",
         "deviceRpcRequestProtoSchema":"syntax =\"proto3\";\npackage rpc;\n\nmessage RpcRequestMsg {\n  optional string method = 1;\n  optional int32 requestId = 2;\n  optional string params = 3;\n}",
         "deviceRpcResponseProtoSchema":"syntax =\"proto3\";\npackage rpc;\n\nmessage RpcResponseMsg {\n  optional string payload = 1;\n}"
      }
   }
}
```

Let's review some specific objects examples related to the device profile configuration:

# Alarm Schedule

Alarm Schedule JSON object represents the time interval during which the alarm rule is active. Note, 

```json
"schedule": null
```

means alarm rule is active all the time. **'daysOfWeek'** field represents Monday as 1, Tuesday as 2 and so on. **'startsOn'** and **'endsOn'** fields represent hours in millis (e.g. 64800000 = 18:00 or 6pm). **'enabled'** flag specifies if item in a custom rule is active for specific day of the week:

## Specific Time Schedule

```json
{
   "schedule":{
      "type":"SPECIFIC_TIME",
      "endsOn":64800000,
      "startsOn":43200000,
      "timezone":"Europe/Kiev",
      "daysOfWeek":[
         1,
         3,
         5
      ]
   }
}
```

## Custom Schedule

```json
{
   "schedule":{
      "type":"CUSTOM",
      "items":[
         {
            "endsOn":0,
            "enabled":false,
            "startsOn":0,
            "dayOfWeek":1
         },
         {
            "endsOn":64800000,
            "enabled":true,
            "startsOn":43200000,
            "dayOfWeek":2
         },
         {
            "endsOn":0,
            "enabled":false,
            "startsOn":0,
            "dayOfWeek":3
         },
         {
            "endsOn":57600000,
            "enabled":true,
            "startsOn":36000000,
            "dayOfWeek":4
         },
         {
            "endsOn":0,
            "enabled":false,
            "startsOn":0,
            "dayOfWeek":5
         },
         {
            "endsOn":0,
            "enabled":false,
            "startsOn":0,
            "dayOfWeek":6
         },
         {
            "endsOn":0,
            "enabled":false,
            "startsOn":0,
            "dayOfWeek":7
         }
      ],
      "timezone":"Europe/Kiev"
   }
}
```

# Alarm condition type (**'spec'**)

Alarm condition type can be either simple, duration, or repeating. For example, 5 times in a row or during 5 minutes.

Note, **'userValue'** field is not used and reserved for future usage, **'dynamicValue'** is used for condition appliance by using the value of the **'sourceAttribute'** or else **'defaultValue'** is used (if **'sourceAttribute'** is absent).

**'sourceType'** of the **'sourceAttribute'** can be: 
 * 'CURRENT_DEVICE';
 * 'CURRENT_CUSTOMER';
 * 'CURRENT_TENANT'.

**'sourceAttribute'** can be inherited from the owner if **'inherit'** is set to true (for CURRENT_DEVICE and CURRENT_CUSTOMER).

## Repeating alarm condition

```json
{
   "spec":{
      "type":"REPEATING",
      "predicate":{
         "userValue":null,
         "defaultValue":5,
         "dynamicValue":{
            "inherit":true,
            "sourceType":"CURRENT_DEVICE",
            "sourceAttribute":"tempAttr"
         }
      }
   }
}
```

## Duration alarm condition

```json
{
   "spec":{
      "type":"DURATION",
      "unit":"MINUTES",
      "predicate":{
         "userValue":null,
         "defaultValue":30,
         "dynamicValue":null
      }
   }
}
```

**'unit'** can be: 
 * 'SECONDS';
 * 'MINUTES';
 * 'HOURS';
 * 'DAYS'.

# Key Filters

Key filter objects are created under the **'condition'** array. They allow you to define complex logical expressions over entity field, attribute, latest time-series value or constant. The filter is defined using 'key', 'valueType', 'value' (refers to the value of the 'CONSTANT' alarm filter key type) and 'predicate' objects. Let's review each object:

## Alarm Filter Key

Filter Key defines either entity field, attribute, telemetry or constant. It is a JSON object that consists the key name and type. The following filter key types are supported:
 * 'ATTRIBUTE' - used for attributes values;
 * 'TIME_SERIES' - used for time-series values;
 * 'ENTITY_FIELD' - used for accessing entity fields like 'name', 'label', etc. The list of available fields depends on the entity type;
 * 'CONSTANT' - constant value specified.

Let's review the example:

```json
{
  "type": "TIME_SERIES",
  "key": "temperature"
}
```

## Value Type and Operations

Provides a hint about the data type of the entity field that is defined in the filter key. The value type impacts the list of possible operations that you may use in the corresponding predicate. For example, you may use 'STARTS_WITH' or 'END_WITH', but you can't use 'GREATER_OR_EQUAL' for string values.The following filter value types and corresponding predicate operations are supported: 

 * 'STRING' - used to filter any 'String' or 'JSON' values. Operations: EQUAL, NOT_EQUAL, STARTS_WITH, ENDS_WITH, CONTAINS, NOT_CONTAINS; 
 * 'NUMERIC' - used for 'Long' and 'Double' values. Operations: EQUAL, NOT_EQUAL, GREATER, LESS, GREATER_OR_EQUAL, LESS_OR_EQUAL; 
 * 'BOOLEAN' - used for boolean values. Operations: EQUAL, NOT_EQUAL;
 * 'DATE_TIME' - similar to numeric, transforms value to milliseconds since epoch. Operations: EQUAL, NOT_EQUAL, GREATER, LESS, GREATER_OR_EQUAL, LESS_OR_EQUAL; 




## Filter Predicate

Filter Predicate defines the logical expression to evaluate. The list of available operations depends on the filter value type, see above. Platform supports 4 predicate types: 'STRING', 'NUMERIC', 'BOOLEAN' and 'COMPLEX'. The last one allows to combine multiple operations over one filter key.

Simple predicate example to check 'value < 100': 

```json
{
  "operation": "LESS",
  "value": {
    "userValue": null,
    "defaultValue": 100,
    "dynamicValue": null
  },
  "type": "NUMERIC"
}
```

Complex predicate example, to check 'value < 10 or value > 20': 

```json
{
  "type": "COMPLEX",
  "operation": "OR",
  "predicates": [
    {
      "operation": "LESS",
      "value": {
        "userValue": null,
        "defaultValue": 10,
        "dynamicValue": null
      },
      "type": "NUMERIC"
    },
    {
      "operation": "GREATER",
      "value": {
        "userValue": null,
        "defaultValue": 20,
        "dynamicValue": null
      },
      "type": "NUMERIC"
    }
  ]
}
```

More complex predicate example, to check 'value < 10 or (value > 50 && value < 60)': 

```json
{
  "type": "COMPLEX",
  "operation": "OR",
  "predicates": [
    {
      "operation": "LESS",
      "value": {
        "userValue": null,
        "defaultValue": 10,
        "dynamicValue": null
      },
      "type": "NUMERIC"
    },
    {
      "type": "COMPLEX",
      "operation": "AND",
      "predicates": [
        {
          "operation": "GREATER",
          "value": {
            "userValue": null,
            "defaultValue": 50,
            "dynamicValue": null
          },
          "type": "NUMERIC"
        },
        {
          "operation": "LESS",
          "value": {
            "userValue": null,
            "defaultValue": 60,
            "dynamicValue": null
          },
          "type": "NUMERIC"
        }
      ]
    }
  ]
}
```

You may also want to replace hardcoded values (for example, temperature > 20) with the more dynamic expression (for example, temperature > value of the tenant attribute with key 'temperatureThreshold'). It is possible to use 'dynamicValue' to define attribute of the tenant, customer or device. See example below:

```json
{
  "operation": "GREATER",
  "value": {
    "userValue": null,
    "defaultValue": 0,
    "dynamicValue": {
      "inherit": false,
      "sourceType": "CURRENT_TENANT",
      "sourceAttribute": "temperatureThreshold"
    }
  },
  "type": "NUMERIC"
}
```

Note that you may use 'CURRENT_DEVICE', 'CURRENT_CUSTOMER' and 'CURRENT_TENANT' as a 'sourceType'. The 'defaultValue' is used when the attribute with such a name is not defined for the chosen source. The 'sourceAttribute' can be inherited from the owner of the specified 'sourceType' if 'inherit' is set to true.

# Provision Configuration

There are 3 types of device provision configuration for the device profile: 
 * 'DISABLED';
 * 'ALLOW_CREATE_NEW_DEVICES';
 * 'CHECK_PRE_PROVISIONED_DEVICES'.

Please refer to the [docs](https://thingsboard.io/docs/user-guide/device-provisioning/) for more details.

# Transport Configuration

5 transport configuration types are available:
 * 'DEFAULT';
 * 'MQTT';
 * 'LWM2M';
 * 'COAP';
 * 'SNMP'.

Default type supports basic MQTT, HTTP, CoAP and LwM2M transports. Please refer to the [docs](https://thingsboard.io/docs/user-guide/device-profiles/#transport-configuration) for more details about other types.

See another example of COAP transport configuration below:

```json
{
   "type":"COAP",
   "clientSettings":{
      "edrxCycle":null,
      "powerMode":"DRX",
      "psmActivityTimer":null,
      "pagingTransmissionWindow":null
   },
   "coapDeviceTypeConfiguration":{
      "coapDeviceType":"DEFAULT",
      "transportPayloadTypeConfiguration":{
         "transportPayloadType":"JSON"
      }
   }
}
```

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#saveDeviceProfileUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveDeviceProfileUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/deviceProfile';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Get a set of unique attribute keys used by devices that belong to specified profile. If profile is not set returns a list of unique keys among all profiles. The call is used for auto-complete in the UI forms. The implementation limits the number of devices that participate in search to 100 as a trade of between accurate results and time-consuming queries. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getAttributesKeysUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.deviceProfileId - A string value representing the device profile id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getAttributesKeysUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/deviceProfile/devices/keys/attributes{?deviceProfileId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['deviceProfileId'] !== undefined){
                    queryParameters['deviceProfileId'] = parameters['deviceProfileId'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Get a set of unique time-series keys used by devices that belong to specified profile. If profile is not set returns a list of unique keys among all profiles. The call is used for auto-complete in the UI forms. The implementation limits the number of devices that participate in search to 100 as a trade of between accurate results and time-consuming queries. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTimeseriesKeysUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.deviceProfileId - A string value representing the device profile id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getTimeseriesKeysUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/deviceProfile/devices/keys/timeseries{?deviceProfileId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['deviceProfileId'] !== undefined){
                    queryParameters['deviceProfileId'] = parameters['deviceProfileId'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the Device Profile object based on the provided Device Profile Id. The server checks that the device profile is owned by the same tenant. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getDeviceProfileByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.deviceProfileId - A string value representing the device profile id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getDeviceProfileByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/deviceProfile/{deviceProfileId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{deviceProfileId}', parameters['deviceProfileId']);
        
        


        if(parameters['deviceProfileId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceProfileId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Deletes the device profile. Referencing non-existing device profile Id will cause an error. Can't delete the device profile if it is referenced by existing devices.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#deleteDeviceProfileUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.deviceProfileId - A string value representing the device profile id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.deleteDeviceProfileUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/deviceProfile/{deviceProfileId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{deviceProfileId}', parameters['deviceProfileId']);
        
        


        if(parameters['deviceProfileId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceProfileId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Marks device profile as default within a tenant scope.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#setDefaultDeviceProfileUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.deviceProfileId - A string value representing the device profile id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.setDefaultDeviceProfileUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/deviceProfile/{deviceProfileId}/default';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{deviceProfileId}', parameters['deviceProfileId']);
        
        


        if(parameters['deviceProfileId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceProfileId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the Default Device Profile Info object. Device Profile Info is a lightweight object that includes main information about Device Profile excluding the heavyweight configuration object. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getDefaultDeviceProfileInfoUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.getDefaultDeviceProfileInfoUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/deviceProfileInfo/default';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the Device Profile Info object based on the provided Device Profile Id. Device Profile Info is a lightweight object that includes main information about Device Profile excluding the heavyweight configuration object. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getDeviceProfileInfoByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.deviceProfileId - A string value representing the device profile id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getDeviceProfileInfoByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/deviceProfileInfo/{deviceProfileId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{deviceProfileId}', parameters['deviceProfileId']);
        
        


        if(parameters['deviceProfileId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceProfileId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of devices profile info objects owned by tenant. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. Device Profile Info is a lightweight object that includes main information about Device Profile excluding the heavyweight configuration object. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getDeviceProfileInfosUsingGET
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the device profile name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
     * @param {string} parameters.transportType - Type of the transport
 */
 ThingsboardRestApi.prototype.getDeviceProfileInfosUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/deviceProfileInfos{?page,pageSize,sortOrder,sortProperty,textSearch,transportType}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 

                if(parameters['transportType'] !== undefined){
                    queryParameters['transportType'] = parameters['transportType'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of devices profile objects owned by tenant. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getDeviceProfilesUsingGET
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the device profile name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getDeviceProfilesUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/deviceProfiles{?page,pageSize,sortOrder,sortProperty,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Clears assignment of the edge to customer. Customer will not be able to query edge afterwards.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#unassignEdgeFromCustomerUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeId - A string value representing the edge id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.unassignEdgeFromCustomerUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/edge/{edgeId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Edge will be available for non-authorized (not logged-in) users. This is useful to create dashboards that you plan to share/embed on a publicly available website. However, users that are logged-in and belong to different tenant will not be able to access the edge.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#assignEdgeToPublicCustomerUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeId - A string value representing the edge id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.assignEdgeToPublicCustomerUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/public/edge/{edgeId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Creates assignment of the edge to customer. Customer will be able to query edge afterwards.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#assignEdgeToCustomerUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.customerId - A string value representing the customer id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.edgeId - A string value representing the edge id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.assignEdgeToCustomerUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/{customerId}/edge/{edgeId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{customerId}', parameters['customerId']);
        
        


        if(parameters['customerId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: customerId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of edges info objects assigned to customer. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. Edge Info is an extension of the default Edge object that contains information about the assigned customer name. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getCustomerEdgeInfosUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.customerId - A string value representing the customer id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.type - A string value representing the edge type. For example, 'default'
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the edge name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getCustomerEdgeInfosUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/{customerId}/edgeInfos{?page,pageSize,sortOrder,sortProperty,textSearch,type}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{customerId}', parameters['customerId']);
        
        


        if(parameters['customerId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: customerId'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['type'] !== undefined){
                    queryParameters['type'] = parameters['type'];
                }
        
        
        


 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of edges objects assigned to customer. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getCustomerEdgesUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.customerId - A string value representing the customer id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.type - A string value representing the edge type. For example, 'default'
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the edge name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getCustomerEdgesUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/{customerId}/edges{?page,pageSize,sortOrder,sortProperty,textSearch,type}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{customerId}', parameters['customerId']);
        
        


        if(parameters['customerId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: customerId'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['type'] !== undefined){
                    queryParameters['type'] = parameters['type'];
                }
        
        
        


 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Create or update the Edge. When creating edge, platform generates Edge Id as [time-based UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_1_(date-time_and_MAC_address)). The newly created edge id will be present in the response. Specify existing Edge id to update the edge. Referencing non-existing Edge Id will cause 'Not Found' error.

Edge name is unique in the scope of tenant. Use unique identifiers like MAC or IMEI for the edge names and non-unique 'label' field for user-friendly visualization purposes.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#saveEdgeUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveEdgeUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * There's an ability to import the bulk of edges using the only .csv file.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#processEdgesBulkImportUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.processEdgesBulkImportUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge/bulk_import';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Get the Edge Info object based on the provided Edge Id. If the user has the authority of 'Tenant Administrator', the server checks that the edge is owned by the same tenant. If the user has the authority of 'Customer User', the server checks that the edge is assigned to the same customer.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getEdgeInfoByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeId - A string value representing the edge id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getEdgeInfoByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge/info/{edgeId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns list of rule chains ids that are not assigned to particular edge, but these rule chains are present in the already assigned rule chains to edge.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#findMissingToRelatedRuleChainsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeId - A string value representing the edge id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.findMissingToRelatedRuleChainsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge/missingToRelatedRuleChains/{edgeId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Starts synchronization process between edge and cloud. 
All entities that are assigned to particular edge are going to be send to remote edge service.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#syncEdgeUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeId - A string value representing the edge id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.syncEdgeUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge/sync/{edgeId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a set of unique edge types based on edges that are either owned by the tenant or assigned to the customer which user is performing the request.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getEdgeTypesUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.getEdgeTypesUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge/types';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Get the Edge object based on the provided Edge Id. If the user has the authority of 'Tenant Administrator', the server checks that the edge is owned by the same tenant. If the user has the authority of 'Customer User', the server checks that the edge is assigned to the same customer.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getEdgeByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeId - A string value representing the edge id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getEdgeByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge/{edgeId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Deletes the edge. Referencing non-existing edge Id will cause an error.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#deleteEdgeUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeId - A string value representing the edge id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.deleteEdgeUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge/{edgeId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Change root rule chain of the edge to the new provided rule chain. 
This operation will send a notification to update root rule chain on remote edge service.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#setEdgeRootRuleChainUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeId - A string value representing the edge id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.ruleChainId - A string value representing the rule chain id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.setEdgeRootRuleChainUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge/{edgeId}/{ruleChainId}/root';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{ruleChainId}', parameters['ruleChainId']);
        
        


        if(parameters['ruleChainId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: ruleChainId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns all edges that are related to the specific entity. The entity id, relation type, edge types, depth of the search, and other query parameters defined using complex 'EdgeSearchQuery' object. See 'Model' tab of the Parameters for more info.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#findByQueryUsingPOST_2
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.findByQueryUsingPOST_2 = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edges';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns 'true' if edges support enabled on server, 'false' - otherwise.
 * @method
 * @name ThingsboardRestApi#isEdgesSupportEnabledUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.isEdgesSupportEnabledUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edges/enabled';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Requested edges must be owned by tenant or assigned to customer which user is performing the request.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getEdgesByIdsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeIds - A list of edges ids, separated by comma ','
 */
 ThingsboardRestApi.prototype.getEdgesByIdsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edges{?edgeIds}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['edgeIds'] !== undefined){
                    queryParameters['edgeIds'] = parameters['edgeIds'];
                }
        
        
        


        if(parameters['edgeIds'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeIds'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of edges owned by tenant. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getEdgesUsingGET
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the edge name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getEdgesUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edges{?page,pageSize,sortOrder,sortProperty,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Activates edge license on license portal.
 * @method
 * @name ThingsboardRestApi#activateInstanceUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.licenseSecret - licenseSecret
     * @param {string} parameters.releaseDate - releaseDate
 */
 ThingsboardRestApi.prototype.activateInstanceUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/license/activateInstance{?licenseSecret,releaseDate}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['licenseSecret'] !== undefined){
                    queryParameters['licenseSecret'] = parameters['licenseSecret'];
                }
        
        
        


        if(parameters['licenseSecret'] === undefined){
            deferred.reject(new Error('Missing required  parameter: licenseSecret'));
            return deferred.promise;
        }
 

                if(parameters['releaseDate'] !== undefined){
                    queryParameters['releaseDate'] = parameters['releaseDate'];
                }
        
        
        


        if(parameters['releaseDate'] === undefined){
            deferred.reject(new Error('Missing required  parameter: releaseDate'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Checks license request from edge service by forwarding request to license portal.
 * @method
 * @name ThingsboardRestApi#checkInstanceUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.checkInstanceUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/license/checkInstance';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of edges info objects owned by tenant. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. Edge Info is an extension of the default Edge object that contains information about the assigned customer name. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantEdgeInfosUsingGET
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.type - A string value representing the edge type. For example, 'default'
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the edge name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getTenantEdgeInfosUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenant/edgeInfos{?page,pageSize,sortOrder,sortProperty,textSearch,type}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['type'] !== undefined){
                    queryParameters['type'] = parameters['type'];
                }
        
        
        


 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Requested edge must be owned by tenant or customer that the user belongs to. Edge name is an unique property of edge. So it can be used to identify the edge.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantEdgeUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeName - Unique name of the edge
 */
 ThingsboardRestApi.prototype.getTenantEdgeUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenant/edges{?edgeName}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['edgeName'] !== undefined){
                    queryParameters['edgeName'] = parameters['edgeName'];
                }
        
        
        


        if(parameters['edgeName'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeName'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of edges owned by tenant. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantEdgesUsingGET
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.type - A string value representing the edge type. For example, 'default'
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the edge name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getTenantEdgesUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenant/edges{?page,pageSize,sortOrder,sortProperty,textSearch,type}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['type'] !== undefined){
                    queryParameters['type'] = parameters['type'];
                }
        
        
        


 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of edge events for the requested edge. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 
 * @method
 * @name ThingsboardRestApi#getEdgeEventsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeId - A string value representing the edge id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the edge event type name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
     * @param {integer} parameters.startTime - Timestamp. Edge events with creation time before it won't be queried
     * @param {integer} parameters.endTime - Timestamp. Edge events with creation time after it won't be queried
 */
 ThingsboardRestApi.prototype.getEdgeEventsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge/{edgeId}/events{?endTime,page,pageSize,sortOrder,sortProperty,startTime,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 

                if(parameters['startTime'] !== undefined){
                    queryParameters['startTime'] = parameters['startTime'];
                }
        
        
        


 

                if(parameters['endTime'] !== undefined){
                    queryParameters['endTime'] = parameters['endTime'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * This method description defines how Alarm Data Query extends the Entity Data Query. See method 'Find Entity Data by Query' first to get the info about 'Entity Data Query'.

 The platform will first search the entities that match the entity and key filters. Then, the platform will use 'Alarm Page Link' to filter the alarms related to those entities. Finally, platform fetch the properties of alarm that are defined in the **'alarmFields'** and combine them with the other entity, attribute and latest time-series fields to return the result. 

 See example of the alarm query below. The query will search first 100 active alarms with type 'Temperature Alarm' or 'Fire Alarm' for any device with current temperature > 0. The query will return combination of the entity fields: name of the device, device model and latest temperature reading and alarms fields: createdTime, type, severity and status: 

```json
{
  "entityFilter": {
    "type": "entityType",
    "resolveMultiple": true,
    "entityType": "DEVICE"
  },
  "pageLink": {
    "page": 0,
    "pageSize": 100,
    "textSearch": null,
    "searchPropagatedAlarms": false,
    "statusList": [
      "ACTIVE"
    ],
    "severityList": [
      "CRITICAL",
      "MAJOR"
    ],
    "typeList": [
      "Temperature Alarm",
      "Fire Alarm"
    ],
    "sortOrder": {
      "key": {
        "key": "createdTime",
        "type": "ALARM_FIELD"
      },
      "direction": "DESC"
    },
    "timeWindow": 86400000
  },
  "keyFilters": [
    {
      "key": {
        "type": "TIME_SERIES",
        "key": "temperature"
      },
      "valueType": "NUMERIC",
      "predicate": {
        "operation": "GREATER",
        "value": {
          "defaultValue": 0,
          "dynamicValue": null
        },
        "type": "NUMERIC"
      }
    }
  ],
  "alarmFields": [
    {
      "type": "ALARM_FIELD",
      "key": "createdTime"
    },
    {
      "type": "ALARM_FIELD",
      "key": "type"
    },
    {
      "type": "ALARM_FIELD",
      "key": "severity"
    },
    {
      "type": "ALARM_FIELD",
      "key": "status"
    }
  ],
  "entityFields": [
    {
      "type": "ENTITY_FIELD",
      "key": "name"
    }
  ],
  "latestValues": [
    {
      "type": "ATTRIBUTE",
      "key": "model"
    },
    {
      "type": "TIME_SERIES",
      "key": "temperature"
    }
  ]
}
```
 * @method
 * @name ThingsboardRestApi#findAlarmDataByQueryUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.findAlarmDataByQueryUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/alarmsQuery/find';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Allows to run complex queries to search the count of platform entities (devices, assets, customers, etc) based on the combination of main entity filter and multiple key filters. Returns the number of entities that match the query definition.

# Query Definition



Main **entity filter** is mandatory and defines generic search criteria. For example, "find all devices with profile 'Moisture Sensor'" or "Find all devices related to asset 'Building A'"

Optional **key filters** allow to filter results of the entity filter by complex criteria against main entity fields (name, label, type, etc), attributes and telemetry. For example, "temperature > 20 or temperature< 10" or "name starts with 'T', and attribute 'model' is 'T1000', and timeseries field 'batteryLevel' > 40".

Let's review the example:

```json
{
  "entityFilter": {
    "type": "entityType",
    "entityType": "DEVICE"
  },
  "keyFilters": [
    {
      "key": {
        "type": "ATTRIBUTE",
        "key": "active"
      },
      "valueType": "BOOLEAN",
      "predicate": {
        "operation": "EQUAL",
        "value": {
          "defaultValue": true,
          "dynamicValue": null
        },
        "type": "BOOLEAN"
      }
    }
  ]
}
```

 Example mentioned above search all devices which have attribute 'active' set to 'true'. Now let's review available entity filters and key filters syntax:

 # Entity Filters
Entity Filter body depends on the 'type' parameter. Let's review available entity filter types. In fact, they do correspond to available dashboard aliases.

## Single Entity

Allows to filter only one entity based on the id. For example, this entity filter selects certain device:

```json
{
  "type": "singleEntity",
  "singleEntity": {
    "id": "d521edb0-2a7a-11ec-94eb-213c95f54092",
    "entityType": "DEVICE"
  }
}
```

## Entity List Filter

Allows to filter entities of the same type using their ids. For example, this entity filter selects two devices:

```json
{
  "type": "entityList",
  "entityType": "DEVICE",
  "entityList": [
    "e6501f30-2a7a-11ec-94eb-213c95f54092",
    "e6657bf0-2a7a-11ec-94eb-213c95f54092"
  ]
}
```

## Entity Name Filter

Allows to filter entities of the same type using the **'starts with'** expression over entity name. For example, this entity filter selects all devices which name starts with 'Air Quality':

```json
{
  "type": "entityName",
  "entityType": "DEVICE",
  "entityNameFilter": "Air Quality"
}
```

## Entity Type Filter

Allows to filter entities based on their type (CUSTOMER, USER, DASHBOARD, ASSET, DEVICE, etc)For example, this entity filter selects all tenant customers:

```json
{
  "type": "entityType",
  "entityType": "CUSTOMER"
}
```

## Asset Type Filter

Allows to filter assets based on their type and the **'starts with'** expression over their name. For example, this entity filter selects all 'charging station' assets which name starts with 'Tesla':

```json
{
  "type": "assetType",
  "assetType": "charging station",
  "assetNameFilter": "Tesla"
}
```

## Device Type Filter

Allows to filter devices based on their type and the **'starts with'** expression over their name. For example, this entity filter selects all 'Temperature Sensor' devices which name starts with 'ABC':

```json
{
  "type": "deviceType",
  "deviceType": "Temperature Sensor",
  "deviceNameFilter": "ABC"
}
```

## Edge Type Filter

Allows to filter edge instances based on their type and the **'starts with'** expression over their name. For example, this entity filter selects all 'Factory' edge instances which name starts with 'Nevada':

```json
{
  "type": "edgeType",
  "edgeType": "Factory",
  "edgeNameFilter": "Nevada"
}
```

## Entity View Filter

Allows to filter entity views based on their type and the **'starts with'** expression over their name. For example, this entity filter selects all 'Concrete Mixer' entity views which name starts with 'CAT':

```json
{
  "type": "entityViewType",
  "entityViewType": "Concrete Mixer",
  "entityViewNameFilter": "CAT"
}
```

## Api Usage Filter

Allows to query for Api Usage based on optional customer id. If the customer id is not set, returns current tenant API usage.For example, this entity filter selects the 'Api Usage' entity for customer with id 'e6501f30-2a7a-11ec-94eb-213c95f54092':

```json
{
  "type": "apiUsageState",
  "customerId": {
    "id": "d521edb0-2a7a-11ec-94eb-213c95f54092",
    "entityType": "CUSTOMER"
  }
}
```

## Relations Query Filter

Allows to filter entities that are related to the provided root entity. Possible direction values are 'TO' and 'FROM'. The 'maxLevel' defines how many relation levels should the query search 'recursively'. Assuming the 'maxLevel' is > 1, the 'fetchLastLevelOnly' defines either to return all related entities or only entities that are on the last level of relations. The 'filter' object allows you to define the relation type and set of acceptable entity types to search for. The relation query calculates all related entities, even if they are filtered using different relation types, and then extracts only those who match the 'filters'.

For example, this entity filter selects all devices and assets which are related to the asset with id 'e51de0c0-2a7a-11ec-94eb-213c95f54092':

```json
{
  "type": "relationsQuery",
  "rootEntity": {
    "entityType": "ASSET",
    "id": "e51de0c0-2a7a-11ec-94eb-213c95f54092"
  },
  "direction": "FROM",
  "maxLevel": 1,
  "fetchLastLevelOnly": false,
  "filters": [
    {
      "relationType": "Contains",
      "entityTypes": [
        "DEVICE",
        "ASSET"
      ]
    }
  ]
}
```

## Asset Search Query

Allows to filter assets that are related to the provided root entity. Filters related assets based on the relation type and set of asset types. Possible direction values are 'TO' and 'FROM'. The 'maxLevel' defines how many relation levels should the query search 'recursively'. Assuming the 'maxLevel' is > 1, the 'fetchLastLevelOnly' defines either to return all related entities or only entities that are on the last level of relations. The 'relationType' defines the type of the relation to search for. The 'assetTypes' defines the type of the asset to search for. The relation query calculates all related entities, even if they are filtered using different relation types, and then extracts only assets that match 'relationType' and 'assetTypes' conditions.

For example, this entity filter selects 'charging station' assets which are related to the asset with id 'e51de0c0-2a7a-11ec-94eb-213c95f54092' using 'Contains' relation:

```json
{
  "type": "assetSearchQuery",
  "rootEntity": {
    "entityType": "ASSET",
    "id": "e51de0c0-2a7a-11ec-94eb-213c95f54092"
  },
  "direction": "FROM",
  "maxLevel": 1,
  "fetchLastLevelOnly": false,
  "relationType": "Contains",
  "assetTypes": [
    "charging station"
  ]
}
```

## Device Search Query

Allows to filter devices that are related to the provided root entity. Filters related devices based on the relation type and set of device types. Possible direction values are 'TO' and 'FROM'. The 'maxLevel' defines how many relation levels should the query search 'recursively'. Assuming the 'maxLevel' is > 1, the 'fetchLastLevelOnly' defines either to return all related entities or only entities that are on the last level of relations. The 'relationType' defines the type of the relation to search for. The 'deviceTypes' defines the type of the device to search for. The relation query calculates all related entities, even if they are filtered using different relation types, and then extracts only devices that match 'relationType' and 'deviceTypes' conditions.

For example, this entity filter selects 'Charging port' and 'Air Quality Sensor' devices which are related to the asset with id 'e52b0020-2a7a-11ec-94eb-213c95f54092' using 'Contains' relation:

```json
{
  "type": "deviceSearchQuery",
  "rootEntity": {
    "entityType": "ASSET",
    "id": "e52b0020-2a7a-11ec-94eb-213c95f54092"
  },
  "direction": "FROM",
  "maxLevel": 2,
  "fetchLastLevelOnly": true,
  "relationType": "Contains",
  "deviceTypes": [
    "Air Quality Sensor",
    "Charging port"
  ]
}
```

## Entity View Query

Allows to filter entity views that are related to the provided root entity. Filters related entity views based on the relation type and set of entity view types. Possible direction values are 'TO' and 'FROM'. The 'maxLevel' defines how many relation levels should the query search 'recursively'. Assuming the 'maxLevel' is > 1, the 'fetchLastLevelOnly' defines either to return all related entities or only entities that are on the last level of relations. The 'relationType' defines the type of the relation to search for. The 'entityViewTypes' defines the type of the entity view to search for. The relation query calculates all related entities, even if they are filtered using different relation types, and then extracts only devices that match 'relationType' and 'deviceTypes' conditions.

For example, this entity filter selects 'Concrete mixer' entity views which are related to the asset with id 'e52b0020-2a7a-11ec-94eb-213c95f54092' using 'Contains' relation:

```json
{
  "type": "entityViewSearchQuery",
  "rootEntity": {
    "entityType": "ASSET",
    "id": "e52b0020-2a7a-11ec-94eb-213c95f54092"
  },
  "direction": "FROM",
  "maxLevel": 1,
  "fetchLastLevelOnly": false,
  "relationType": "Contains",
  "entityViewTypes": [
    "Concrete mixer"
  ]
}
```

## Edge Search Query

Allows to filter edge instances that are related to the provided root entity. Filters related edge instances based on the relation type and set of edge types. Possible direction values are 'TO' and 'FROM'. The 'maxLevel' defines how many relation levels should the query search 'recursively'. Assuming the 'maxLevel' is > 1, the 'fetchLastLevelOnly' defines either to return all related entities or only entities that are on the last level of relations. The 'relationType' defines the type of the relation to search for. The 'deviceTypes' defines the type of the device to search for. The relation query calculates all related entities, even if they are filtered using different relation types, and then extracts only devices that match 'relationType' and 'deviceTypes' conditions.

For example, this entity filter selects 'Factory' edge instances which are related to the asset with id 'e52b0020-2a7a-11ec-94eb-213c95f54092' using 'Contains' relation:

```json
{
  "type": "deviceSearchQuery",
  "rootEntity": {
    "entityType": "ASSET",
    "id": "e52b0020-2a7a-11ec-94eb-213c95f54092"
  },
  "direction": "FROM",
  "maxLevel": 2,
  "fetchLastLevelOnly": true,
  "relationType": "Contains",
  "edgeTypes": [
    "Factory"
  ]
}
```

 # Key Filters
Key Filter allows you to define complex logical expressions over entity field, attribute or latest time-series value. The filter is defined using 'key', 'valueType' and 'predicate' objects. Single Entity Query may have zero, one or multiple predicates. If multiple filters are defined, they are evaluated using logical 'AND'. The example below checks that temperature of the entity is above 20 degrees:

```json
{
  "key": {
    "type": "TIME_SERIES",
    "key": "temperature"
  },
  "valueType": "NUMERIC",
  "predicate": {
    "operation": "GREATER",
    "value": {
      "defaultValue": 20,
      "dynamicValue": null
    },
    "type": "NUMERIC"
  }
}
```

 Now let's review 'key', 'valueType' and 'predicate' objects in detail.

## Filter Key

Filter Key defines either entity field, attribute or telemetry. It is a JSON object that consists the key name and type. The following filter key types are supported: 

 * 'CLIENT_ATTRIBUTE' - used for client attributes; 
 * 'SHARED_ATTRIBUTE' - used for shared attributes; 
 * 'SERVER_ATTRIBUTE' - used for server attributes; 
 * 'ATTRIBUTE' - used for any of the above; 
 * 'TIME_SERIES' - used for time-series values; 
 * 'ENTITY_FIELD' - used for accessing entity fields like 'name', 'label', etc. The list of available fields depends on the entity type; 
 * 'ALARM_FIELD' - similar to entity field, but is used in alarm queries only; 


 Let's review the example:

```json
{
  "type": "TIME_SERIES",
  "key": "temperature"
}
```

## Value Type and Operations

Provides a hint about the data type of the entity field that is defined in the filter key. The value type impacts the list of possible operations that you may use in the corresponding predicate. For example, you may use 'STARTS_WITH' or 'END_WITH', but you can't use 'GREATER_OR_EQUAL' for string values.The following filter value types and corresponding predicate operations are supported: 

 * 'STRING' - used to filter any 'String' or 'JSON' values. Operations: EQUAL, NOT_EQUAL, STARTS_WITH, ENDS_WITH, CONTAINS, NOT_CONTAINS; 
 * 'NUMERIC' - used for 'Long' and 'Double' values. Operations: EQUAL, NOT_EQUAL, GREATER, LESS, GREATER_OR_EQUAL, LESS_OR_EQUAL; 
 * 'BOOLEAN' - used for boolean values. Operations: EQUAL, NOT_EQUAL;
 * 'DATE_TIME' - similar to numeric, transforms value to milliseconds since epoch. Operations: EQUAL, NOT_EQUAL, GREATER, LESS, GREATER_OR_EQUAL, LESS_OR_EQUAL; 


## Filter Predicate

Filter Predicate defines the logical expression to evaluate. The list of available operations depends on the filter value type, see above. Platform supports 4 predicate types: 'STRING', 'NUMERIC', 'BOOLEAN' and 'COMPLEX'. The last one allows to combine multiple operations over one filter key.

Simple predicate example to check 'value < 100': 

```json
{
  "operation": "LESS",
  "value": {
    "defaultValue": 100,
    "dynamicValue": null
  },
  "type": "NUMERIC"
}
```

Complex predicate example, to check 'value < 10 or value > 20': 

```json
{
  "type": "COMPLEX",
  "operation": "OR",
  "predicates": [
    {
      "operation": "LESS",
      "value": {
        "defaultValue": 10,
        "dynamicValue": null
      },
      "type": "NUMERIC"
    },
    {
      "operation": "GREATER",
      "value": {
        "defaultValue": 20,
        "dynamicValue": null
      },
      "type": "NUMERIC"
    }
  ]
}
```

More complex predicate example, to check 'value < 10 or (value > 50 && value < 60)': 

```json
{
  "type": "COMPLEX",
  "operation": "OR",
  "predicates": [
    {
      "operation": "LESS",
      "value": {
        "defaultValue": 10,
        "dynamicValue": null
      },
      "type": "NUMERIC"
    },
    {
      "type": "COMPLEX",
      "operation": "AND",
      "predicates": [
        {
          "operation": "GREATER",
          "value": {
            "defaultValue": 50,
            "dynamicValue": null
          },
          "type": "NUMERIC"
        },
        {
          "operation": "LESS",
          "value": {
            "defaultValue": 60,
            "dynamicValue": null
          },
          "type": "NUMERIC"
        }
      ]
    }
  ]
}
```

 You may also want to replace hardcoded values (for example, temperature > 20) with the more dynamic expression (for example, temperature > 'value of the tenant attribute with key 'temperatureThreshold'). It is possible to use 'dynamicValue' to define attribute of the tenant, customer or user that is performing the API call. See example below: 

```json
{
  "operation": "GREATER",
  "value": {
    "defaultValue": 0,
    "dynamicValue": {
      "sourceType": "CURRENT_USER",
      "sourceAttribute": "temperatureThreshold"
    }
  },
  "type": "NUMERIC"
}
```

 Note that you may use 'CURRENT_USER', 'CURRENT_CUSTOMER' and 'CURRENT_TENANT' as a 'sourceType'. The 'defaultValue' is used when the attribute with such a name is not defined for the chosen source.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#countEntitiesByQueryUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.countEntitiesByQueryUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/entitiesQuery/count';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Allows to run complex queries over platform entities (devices, assets, customers, etc) based on the combination of main entity filter and multiple key filters. Returns the paginated result of the query that contains requested entity fields and latest values of requested attributes and time-series data.

# Query Definition



Main **entity filter** is mandatory and defines generic search criteria. For example, "find all devices with profile 'Moisture Sensor'" or "Find all devices related to asset 'Building A'"

Optional **key filters** allow to filter results of the **entity filter** by complex criteria against main entity fields (name, label, type, etc), attributes and telemetry. For example, "temperature > 20 or temperature< 10" or "name starts with 'T', and attribute 'model' is 'T1000', and timeseries field 'batteryLevel' > 40".

The **entity fields** and **latest values** contains list of entity fields and latest attribute/telemetry fields to fetch for each entity.

The **page link** contains information about the page to fetch and the sort ordering.

Let's review the example:

```json
{
  "entityFilter": {
    "type": "entityType",
    "resolveMultiple": true,
    "entityType": "DEVICE"
  },
  "keyFilters": [
    {
      "key": {
        "type": "TIME_SERIES",
        "key": "temperature"
      },
      "valueType": "NUMERIC",
      "predicate": {
        "operation": "GREATER",
        "value": {
          "defaultValue": 0,
          "dynamicValue": {
            "sourceType": "CURRENT_USER",
            "sourceAttribute": "temperatureThreshold",
            "inherit": false
          }
        },
        "type": "NUMERIC"
      }
    }
  ],
  "entityFields": [
    {
      "type": "ENTITY_FIELD",
      "key": "name"
    },
    {
      "type": "ENTITY_FIELD",
      "key": "label"
    },
    {
      "type": "ENTITY_FIELD",
      "key": "additionalInfo"
    }
  ],
  "latestValues": [
    {
      "type": "ATTRIBUTE",
      "key": "model"
    },
    {
      "type": "TIME_SERIES",
      "key": "temperature"
    }
  ],
  "pageLink": {
    "page": 0,
    "pageSize": 10,
    "sortOrder": {
      "key": {
        "key": "name",
        "type": "ENTITY_FIELD"
      },
      "direction": "ASC"
    }
  }
}
```

 Example mentioned above search all devices which have attribute 'active' set to 'true'. Now let's review available entity filters and key filters syntax:

 # Entity Filters
Entity Filter body depends on the 'type' parameter. Let's review available entity filter types. In fact, they do correspond to available dashboard aliases.

## Single Entity

Allows to filter only one entity based on the id. For example, this entity filter selects certain device:

```json
{
  "type": "singleEntity",
  "singleEntity": {
    "id": "d521edb0-2a7a-11ec-94eb-213c95f54092",
    "entityType": "DEVICE"
  }
}
```

## Entity List Filter

Allows to filter entities of the same type using their ids. For example, this entity filter selects two devices:

```json
{
  "type": "entityList",
  "entityType": "DEVICE",
  "entityList": [
    "e6501f30-2a7a-11ec-94eb-213c95f54092",
    "e6657bf0-2a7a-11ec-94eb-213c95f54092"
  ]
}
```

## Entity Name Filter

Allows to filter entities of the same type using the **'starts with'** expression over entity name. For example, this entity filter selects all devices which name starts with 'Air Quality':

```json
{
  "type": "entityName",
  "entityType": "DEVICE",
  "entityNameFilter": "Air Quality"
}
```

## Entity Type Filter

Allows to filter entities based on their type (CUSTOMER, USER, DASHBOARD, ASSET, DEVICE, etc)For example, this entity filter selects all tenant customers:

```json
{
  "type": "entityType",
  "entityType": "CUSTOMER"
}
```

## Asset Type Filter

Allows to filter assets based on their type and the **'starts with'** expression over their name. For example, this entity filter selects all 'charging station' assets which name starts with 'Tesla':

```json
{
  "type": "assetType",
  "assetType": "charging station",
  "assetNameFilter": "Tesla"
}
```

## Device Type Filter

Allows to filter devices based on their type and the **'starts with'** expression over their name. For example, this entity filter selects all 'Temperature Sensor' devices which name starts with 'ABC':

```json
{
  "type": "deviceType",
  "deviceType": "Temperature Sensor",
  "deviceNameFilter": "ABC"
}
```

## Edge Type Filter

Allows to filter edge instances based on their type and the **'starts with'** expression over their name. For example, this entity filter selects all 'Factory' edge instances which name starts with 'Nevada':

```json
{
  "type": "edgeType",
  "edgeType": "Factory",
  "edgeNameFilter": "Nevada"
}
```

## Entity View Filter

Allows to filter entity views based on their type and the **'starts with'** expression over their name. For example, this entity filter selects all 'Concrete Mixer' entity views which name starts with 'CAT':

```json
{
  "type": "entityViewType",
  "entityViewType": "Concrete Mixer",
  "entityViewNameFilter": "CAT"
}
```

## Api Usage Filter

Allows to query for Api Usage based on optional customer id. If the customer id is not set, returns current tenant API usage.For example, this entity filter selects the 'Api Usage' entity for customer with id 'e6501f30-2a7a-11ec-94eb-213c95f54092':

```json
{
  "type": "apiUsageState",
  "customerId": {
    "id": "d521edb0-2a7a-11ec-94eb-213c95f54092",
    "entityType": "CUSTOMER"
  }
}
```

## Relations Query Filter

Allows to filter entities that are related to the provided root entity. Possible direction values are 'TO' and 'FROM'. The 'maxLevel' defines how many relation levels should the query search 'recursively'. Assuming the 'maxLevel' is > 1, the 'fetchLastLevelOnly' defines either to return all related entities or only entities that are on the last level of relations. The 'filter' object allows you to define the relation type and set of acceptable entity types to search for. The relation query calculates all related entities, even if they are filtered using different relation types, and then extracts only those who match the 'filters'.

For example, this entity filter selects all devices and assets which are related to the asset with id 'e51de0c0-2a7a-11ec-94eb-213c95f54092':

```json
{
  "type": "relationsQuery",
  "rootEntity": {
    "entityType": "ASSET",
    "id": "e51de0c0-2a7a-11ec-94eb-213c95f54092"
  },
  "direction": "FROM",
  "maxLevel": 1,
  "fetchLastLevelOnly": false,
  "filters": [
    {
      "relationType": "Contains",
      "entityTypes": [
        "DEVICE",
        "ASSET"
      ]
    }
  ]
}
```

## Asset Search Query

Allows to filter assets that are related to the provided root entity. Filters related assets based on the relation type and set of asset types. Possible direction values are 'TO' and 'FROM'. The 'maxLevel' defines how many relation levels should the query search 'recursively'. Assuming the 'maxLevel' is > 1, the 'fetchLastLevelOnly' defines either to return all related entities or only entities that are on the last level of relations. The 'relationType' defines the type of the relation to search for. The 'assetTypes' defines the type of the asset to search for. The relation query calculates all related entities, even if they are filtered using different relation types, and then extracts only assets that match 'relationType' and 'assetTypes' conditions.

For example, this entity filter selects 'charging station' assets which are related to the asset with id 'e51de0c0-2a7a-11ec-94eb-213c95f54092' using 'Contains' relation:

```json
{
  "type": "assetSearchQuery",
  "rootEntity": {
    "entityType": "ASSET",
    "id": "e51de0c0-2a7a-11ec-94eb-213c95f54092"
  },
  "direction": "FROM",
  "maxLevel": 1,
  "fetchLastLevelOnly": false,
  "relationType": "Contains",
  "assetTypes": [
    "charging station"
  ]
}
```

## Device Search Query

Allows to filter devices that are related to the provided root entity. Filters related devices based on the relation type and set of device types. Possible direction values are 'TO' and 'FROM'. The 'maxLevel' defines how many relation levels should the query search 'recursively'. Assuming the 'maxLevel' is > 1, the 'fetchLastLevelOnly' defines either to return all related entities or only entities that are on the last level of relations. The 'relationType' defines the type of the relation to search for. The 'deviceTypes' defines the type of the device to search for. The relation query calculates all related entities, even if they are filtered using different relation types, and then extracts only devices that match 'relationType' and 'deviceTypes' conditions.

For example, this entity filter selects 'Charging port' and 'Air Quality Sensor' devices which are related to the asset with id 'e52b0020-2a7a-11ec-94eb-213c95f54092' using 'Contains' relation:

```json
{
  "type": "deviceSearchQuery",
  "rootEntity": {
    "entityType": "ASSET",
    "id": "e52b0020-2a7a-11ec-94eb-213c95f54092"
  },
  "direction": "FROM",
  "maxLevel": 2,
  "fetchLastLevelOnly": true,
  "relationType": "Contains",
  "deviceTypes": [
    "Air Quality Sensor",
    "Charging port"
  ]
}
```

## Entity View Query

Allows to filter entity views that are related to the provided root entity. Filters related entity views based on the relation type and set of entity view types. Possible direction values are 'TO' and 'FROM'. The 'maxLevel' defines how many relation levels should the query search 'recursively'. Assuming the 'maxLevel' is > 1, the 'fetchLastLevelOnly' defines either to return all related entities or only entities that are on the last level of relations. The 'relationType' defines the type of the relation to search for. The 'entityViewTypes' defines the type of the entity view to search for. The relation query calculates all related entities, even if they are filtered using different relation types, and then extracts only devices that match 'relationType' and 'deviceTypes' conditions.

For example, this entity filter selects 'Concrete mixer' entity views which are related to the asset with id 'e52b0020-2a7a-11ec-94eb-213c95f54092' using 'Contains' relation:

```json
{
  "type": "entityViewSearchQuery",
  "rootEntity": {
    "entityType": "ASSET",
    "id": "e52b0020-2a7a-11ec-94eb-213c95f54092"
  },
  "direction": "FROM",
  "maxLevel": 1,
  "fetchLastLevelOnly": false,
  "relationType": "Contains",
  "entityViewTypes": [
    "Concrete mixer"
  ]
}
```

## Edge Search Query

Allows to filter edge instances that are related to the provided root entity. Filters related edge instances based on the relation type and set of edge types. Possible direction values are 'TO' and 'FROM'. The 'maxLevel' defines how many relation levels should the query search 'recursively'. Assuming the 'maxLevel' is > 1, the 'fetchLastLevelOnly' defines either to return all related entities or only entities that are on the last level of relations. The 'relationType' defines the type of the relation to search for. The 'deviceTypes' defines the type of the device to search for. The relation query calculates all related entities, even if they are filtered using different relation types, and then extracts only devices that match 'relationType' and 'deviceTypes' conditions.

For example, this entity filter selects 'Factory' edge instances which are related to the asset with id 'e52b0020-2a7a-11ec-94eb-213c95f54092' using 'Contains' relation:

```json
{
  "type": "deviceSearchQuery",
  "rootEntity": {
    "entityType": "ASSET",
    "id": "e52b0020-2a7a-11ec-94eb-213c95f54092"
  },
  "direction": "FROM",
  "maxLevel": 2,
  "fetchLastLevelOnly": true,
  "relationType": "Contains",
  "edgeTypes": [
    "Factory"
  ]
}
```

 # Key Filters
Key Filter allows you to define complex logical expressions over entity field, attribute or latest time-series value. The filter is defined using 'key', 'valueType' and 'predicate' objects. Single Entity Query may have zero, one or multiple predicates. If multiple filters are defined, they are evaluated using logical 'AND'. The example below checks that temperature of the entity is above 20 degrees:

```json
{
  "key": {
    "type": "TIME_SERIES",
    "key": "temperature"
  },
  "valueType": "NUMERIC",
  "predicate": {
    "operation": "GREATER",
    "value": {
      "defaultValue": 20,
      "dynamicValue": null
    },
    "type": "NUMERIC"
  }
}
```

 Now let's review 'key', 'valueType' and 'predicate' objects in detail.

## Filter Key

Filter Key defines either entity field, attribute or telemetry. It is a JSON object that consists the key name and type. The following filter key types are supported: 

 * 'CLIENT_ATTRIBUTE' - used for client attributes; 
 * 'SHARED_ATTRIBUTE' - used for shared attributes; 
 * 'SERVER_ATTRIBUTE' - used for server attributes; 
 * 'ATTRIBUTE' - used for any of the above; 
 * 'TIME_SERIES' - used for time-series values; 
 * 'ENTITY_FIELD' - used for accessing entity fields like 'name', 'label', etc. The list of available fields depends on the entity type; 
 * 'ALARM_FIELD' - similar to entity field, but is used in alarm queries only; 


 Let's review the example:

```json
{
  "type": "TIME_SERIES",
  "key": "temperature"
}
```

## Value Type and Operations

Provides a hint about the data type of the entity field that is defined in the filter key. The value type impacts the list of possible operations that you may use in the corresponding predicate. For example, you may use 'STARTS_WITH' or 'END_WITH', but you can't use 'GREATER_OR_EQUAL' for string values.The following filter value types and corresponding predicate operations are supported: 

 * 'STRING' - used to filter any 'String' or 'JSON' values. Operations: EQUAL, NOT_EQUAL, STARTS_WITH, ENDS_WITH, CONTAINS, NOT_CONTAINS; 
 * 'NUMERIC' - used for 'Long' and 'Double' values. Operations: EQUAL, NOT_EQUAL, GREATER, LESS, GREATER_OR_EQUAL, LESS_OR_EQUAL; 
 * 'BOOLEAN' - used for boolean values. Operations: EQUAL, NOT_EQUAL;
 * 'DATE_TIME' - similar to numeric, transforms value to milliseconds since epoch. Operations: EQUAL, NOT_EQUAL, GREATER, LESS, GREATER_OR_EQUAL, LESS_OR_EQUAL; 


## Filter Predicate

Filter Predicate defines the logical expression to evaluate. The list of available operations depends on the filter value type, see above. Platform supports 4 predicate types: 'STRING', 'NUMERIC', 'BOOLEAN' and 'COMPLEX'. The last one allows to combine multiple operations over one filter key.

Simple predicate example to check 'value < 100': 

```json
{
  "operation": "LESS",
  "value": {
    "defaultValue": 100,
    "dynamicValue": null
  },
  "type": "NUMERIC"
}
```

Complex predicate example, to check 'value < 10 or value > 20': 

```json
{
  "type": "COMPLEX",
  "operation": "OR",
  "predicates": [
    {
      "operation": "LESS",
      "value": {
        "defaultValue": 10,
        "dynamicValue": null
      },
      "type": "NUMERIC"
    },
    {
      "operation": "GREATER",
      "value": {
        "defaultValue": 20,
        "dynamicValue": null
      },
      "type": "NUMERIC"
    }
  ]
}
```

More complex predicate example, to check 'value < 10 or (value > 50 && value < 60)': 

```json
{
  "type": "COMPLEX",
  "operation": "OR",
  "predicates": [
    {
      "operation": "LESS",
      "value": {
        "defaultValue": 10,
        "dynamicValue": null
      },
      "type": "NUMERIC"
    },
    {
      "type": "COMPLEX",
      "operation": "AND",
      "predicates": [
        {
          "operation": "GREATER",
          "value": {
            "defaultValue": 50,
            "dynamicValue": null
          },
          "type": "NUMERIC"
        },
        {
          "operation": "LESS",
          "value": {
            "defaultValue": 60,
            "dynamicValue": null
          },
          "type": "NUMERIC"
        }
      ]
    }
  ]
}
```

 You may also want to replace hardcoded values (for example, temperature > 20) with the more dynamic expression (for example, temperature > 'value of the tenant attribute with key 'temperatureThreshold'). It is possible to use 'dynamicValue' to define attribute of the tenant, customer or user that is performing the API call. See example below: 

```json
{
  "operation": "GREATER",
  "value": {
    "defaultValue": 0,
    "dynamicValue": {
      "sourceType": "CURRENT_USER",
      "sourceAttribute": "temperatureThreshold"
    }
  },
  "type": "NUMERIC"
}
```

 Note that you may use 'CURRENT_USER', 'CURRENT_CUSTOMER' and 'CURRENT_TENANT' as a 'sourceType'. The 'defaultValue' is used when the attribute with such a name is not defined for the chosen source.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#findEntityDataByQueryUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.findEntityDataByQueryUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/entitiesQuery/find';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Uses entity data query (see 'Find Entity Data by Query') to find first 100 entities. Then fetch and return all unique time-series and/or attribute keys. Used mostly for UI hints.
 * @method
 * @name ThingsboardRestApi#findEntityTimeseriesAndAttributesKeysByQueryUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {boolean} parameters.timeseries - Include all unique time-series keys to the result.
     * @param {boolean} parameters.attributes - Include all unique attribute keys to the result.
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.findEntityTimeseriesAndAttributesKeysByQueryUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/entitiesQuery/find/keys{?attributes,timeseries}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];


                if(parameters['timeseries'] !== undefined){
                    queryParameters['timeseries'] = parameters['timeseries'];
                }
        
        
        


        if(parameters['timeseries'] === undefined){
            deferred.reject(new Error('Missing required  parameter: timeseries'));
            return deferred.promise;
        }
 

                if(parameters['attributes'] !== undefined){
                    queryParameters['attributes'] = parameters['attributes'];
                }
        
        
        


        if(parameters['attributes'] === undefined){
            deferred.reject(new Error('Missing required  parameter: attributes'));
            return deferred.promise;
        }
 
        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Creates or updates a relation between two entities in the platform. Relations unique key is a combination of from/to entity id and relation type group and relation type. 

If the user has the authority of 'System Administrator', the server checks that 'from' and 'to' entities are owned by the sysadmin. If the user has the authority of 'Tenant Administrator', the server checks that 'from' and 'to' entities are owned by the same tenant. If the user has the authority of 'Customer User', the server checks that the 'from' and 'to' entities are assigned to the same customer.
 * @method
 * @name ThingsboardRestApi#saveRelationUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveRelationUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/relation';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns all entities that are related to the specific entity. The entity id, relation type, entity types, depth of the search, and other query parameters defined using complex 'EntityRelationsQuery' object. See 'Model' tab of the Parameters for more info.
 * @method
 * @name ThingsboardRestApi#findByQueryUsingPOST_3
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.findByQueryUsingPOST_3 = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/relations';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns all entity infos that are related to the specific entity. The entity id, relation type, entity types, depth of the search, and other query parameters defined using complex 'EntityRelationsQuery' object. See 'Model' tab of the Parameters for more info. Relation Info is an extension of the default Relation object that contains information about the 'from' and 'to' entity names. 
 * @method
 * @name ThingsboardRestApi#findInfoByQueryUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.findInfoByQueryUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/relations/info';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns list of relation info objects for the specified entity by the 'from' direction. 

If the user has the authority of 'System Administrator', the server checks that the entity is owned by the sysadmin. If the user has the authority of 'Tenant Administrator', the server checks that the entity is owned by the same tenant. If the user has the authority of 'Customer User', the server checks that the entity is assigned to the same customer. Relation Info is an extension of the default Relation object that contains information about the 'from' and 'to' entity names. 
 * @method
 * @name ThingsboardRestApi#findInfoByFromUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.fromId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.fromType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.relationTypeGroup - A string value representing relation type group. For example, 'COMMON'
 */
 ThingsboardRestApi.prototype.findInfoByFromUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/relations/info{?fromId,fromType,relationTypeGroup}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['fromId'] !== undefined){
                    queryParameters['fromId'] = parameters['fromId'];
                }
        
        
        


        if(parameters['fromId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: fromId'));
            return deferred.promise;
        }
 

                if(parameters['fromType'] !== undefined){
                    queryParameters['fromType'] = parameters['fromType'];
                }
        
        
        


        if(parameters['fromType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: fromType'));
            return deferred.promise;
        }
 

                if(parameters['relationTypeGroup'] !== undefined){
                    queryParameters['relationTypeGroup'] = parameters['relationTypeGroup'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns list of relation info objects for the specified entity by the 'to' direction. 

If the user has the authority of 'System Administrator', the server checks that the entity is owned by the sysadmin. If the user has the authority of 'Tenant Administrator', the server checks that the entity is owned by the same tenant. If the user has the authority of 'Customer User', the server checks that the entity is assigned to the same customer. Relation Info is an extension of the default Relation object that contains information about the 'from' and 'to' entity names. 
 * @method
 * @name ThingsboardRestApi#findInfoByToUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.toId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.toType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.relationTypeGroup - A string value representing relation type group. For example, 'COMMON'
 */
 ThingsboardRestApi.prototype.findInfoByToUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/relations/info{?relationTypeGroup,toId,toType}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['toId'] !== undefined){
                    queryParameters['toId'] = parameters['toId'];
                }
        
        
        


        if(parameters['toId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: toId'));
            return deferred.promise;
        }
 

                if(parameters['toType'] !== undefined){
                    queryParameters['toType'] = parameters['toType'];
                }
        
        
        


        if(parameters['toType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: toType'));
            return deferred.promise;
        }
 

                if(parameters['relationTypeGroup'] !== undefined){
                    queryParameters['relationTypeGroup'] = parameters['relationTypeGroup'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Deletes all the relation (both 'from' and 'to' direction) for the specified entity. 

If the user has the authority of 'System Administrator', the server checks that the entity is owned by the sysadmin. If the user has the authority of 'Tenant Administrator', the server checks that the entity is owned by the same tenant. If the user has the authority of 'Customer User', the server checks that the entity is assigned to the same customer.
 * @method
 * @name ThingsboardRestApi#deleteRelationsUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.entityType - A string value representing the entity type. For example, 'DEVICE'
 */
 ThingsboardRestApi.prototype.deleteRelationsUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/relations{?entityId,entityType}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['entityId'] !== undefined){
                    queryParameters['entityId'] = parameters['entityId'];
                }
        
        
        


        if(parameters['entityId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityId'));
            return deferred.promise;
        }
 

                if(parameters['entityType'] !== undefined){
                    queryParameters['entityType'] = parameters['entityType'];
                }
        
        
        


        if(parameters['entityType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityType'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns list of relation objects for the specified entity by the 'from' direction and relation type. 

If the user has the authority of 'System Administrator', the server checks that the entity is owned by the sysadmin. If the user has the authority of 'Tenant Administrator', the server checks that the entity is owned by the same tenant. If the user has the authority of 'Customer User', the server checks that the entity is assigned to the same customer.
 * @method
 * @name ThingsboardRestApi#findByFromUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.fromId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.fromType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.relationType - A string value representing relation type between entities. For example, 'Contains', 'Manages'. It can be any string value.
     * @param {string} parameters.relationTypeGroup - A string value representing relation type group. For example, 'COMMON'
 */
 ThingsboardRestApi.prototype.findByFromUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/relations{?fromId,fromType,relationType,relationTypeGroup}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['fromId'] !== undefined){
                    queryParameters['fromId'] = parameters['fromId'];
                }
        
        
        


        if(parameters['fromId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: fromId'));
            return deferred.promise;
        }
 

                if(parameters['fromType'] !== undefined){
                    queryParameters['fromType'] = parameters['fromType'];
                }
        
        
        


        if(parameters['fromType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: fromType'));
            return deferred.promise;
        }
 

                if(parameters['relationType'] !== undefined){
                    queryParameters['relationType'] = parameters['relationType'];
                }
        
        
        


        if(parameters['relationType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: relationType'));
            return deferred.promise;
        }
 

                if(parameters['relationTypeGroup'] !== undefined){
                    queryParameters['relationTypeGroup'] = parameters['relationTypeGroup'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns list of relation objects for the specified entity by the 'from' direction. 

If the user has the authority of 'System Administrator', the server checks that the entity is owned by the sysadmin. If the user has the authority of 'Tenant Administrator', the server checks that the entity is owned by the same tenant. If the user has the authority of 'Customer User', the server checks that the entity is assigned to the same customer.
 * @method
 * @name ThingsboardRestApi#findByFromUsingGET_1
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.fromId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.fromType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.relationTypeGroup - A string value representing relation type group. For example, 'COMMON'
 */
 ThingsboardRestApi.prototype.findByFromUsingGET_1 = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/relations{?fromId,fromType,relationTypeGroup}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['fromId'] !== undefined){
                    queryParameters['fromId'] = parameters['fromId'];
                }
        
        
        


        if(parameters['fromId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: fromId'));
            return deferred.promise;
        }
 

                if(parameters['fromType'] !== undefined){
                    queryParameters['fromType'] = parameters['fromType'];
                }
        
        
        


        if(parameters['fromType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: fromType'));
            return deferred.promise;
        }
 

                if(parameters['relationTypeGroup'] !== undefined){
                    queryParameters['relationTypeGroup'] = parameters['relationTypeGroup'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns list of relation objects for the specified entity by the 'to' direction and relation type. 

If the user has the authority of 'System Administrator', the server checks that the entity is owned by the sysadmin. If the user has the authority of 'Tenant Administrator', the server checks that the entity is owned by the same tenant. If the user has the authority of 'Customer User', the server checks that the entity is assigned to the same customer.
 * @method
 * @name ThingsboardRestApi#findByToUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.toId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.toType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.relationType - A string value representing relation type between entities. For example, 'Contains', 'Manages'. It can be any string value.
     * @param {string} parameters.relationTypeGroup - A string value representing relation type group. For example, 'COMMON'
 */
 ThingsboardRestApi.prototype.findByToUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/relations{?relationType,relationTypeGroup,toId,toType}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['toId'] !== undefined){
                    queryParameters['toId'] = parameters['toId'];
                }
        
        
        


        if(parameters['toId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: toId'));
            return deferred.promise;
        }
 

                if(parameters['toType'] !== undefined){
                    queryParameters['toType'] = parameters['toType'];
                }
        
        
        


        if(parameters['toType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: toType'));
            return deferred.promise;
        }
 

                if(parameters['relationType'] !== undefined){
                    queryParameters['relationType'] = parameters['relationType'];
                }
        
        
        


        if(parameters['relationType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: relationType'));
            return deferred.promise;
        }
 

                if(parameters['relationTypeGroup'] !== undefined){
                    queryParameters['relationTypeGroup'] = parameters['relationTypeGroup'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns list of relation objects for the specified entity by the 'to' direction. 

If the user has the authority of 'System Administrator', the server checks that the entity is owned by the sysadmin. If the user has the authority of 'Tenant Administrator', the server checks that the entity is owned by the same tenant. If the user has the authority of 'Customer User', the server checks that the entity is assigned to the same customer.
 * @method
 * @name ThingsboardRestApi#findByToUsingGET_1
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.toId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.toType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.relationTypeGroup - A string value representing relation type group. For example, 'COMMON'
 */
 ThingsboardRestApi.prototype.findByToUsingGET_1 = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/relations{?relationTypeGroup,toId,toType}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['toId'] !== undefined){
                    queryParameters['toId'] = parameters['toId'];
                }
        
        
        


        if(parameters['toId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: toId'));
            return deferred.promise;
        }
 

                if(parameters['toType'] !== undefined){
                    queryParameters['toType'] = parameters['toType'];
                }
        
        
        


        if(parameters['toType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: toType'));
            return deferred.promise;
        }
 

                if(parameters['relationTypeGroup'] !== undefined){
                    queryParameters['relationTypeGroup'] = parameters['relationTypeGroup'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns relation object between two specified entities if present. Otherwise throws exception. 

If the user has the authority of 'System Administrator', the server checks that 'from' and 'to' entities are owned by the sysadmin. If the user has the authority of 'Tenant Administrator', the server checks that 'from' and 'to' entities are owned by the same tenant. If the user has the authority of 'Customer User', the server checks that the 'from' and 'to' entities are assigned to the same customer.
 * @method
 * @name ThingsboardRestApi#getRelationUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.fromId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.fromType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.relationType - A string value representing relation type between entities. For example, 'Contains', 'Manages'. It can be any string value.
     * @param {string} parameters.relationTypeGroup - A string value representing relation type group. For example, 'COMMON'
     * @param {string} parameters.toId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.toType - A string value representing the entity type. For example, 'DEVICE'
 */
 ThingsboardRestApi.prototype.getRelationUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/relation{?fromId,fromType,relationType,relationTypeGroup,toId,toType}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['fromId'] !== undefined){
                    queryParameters['fromId'] = parameters['fromId'];
                }
        
        
        


        if(parameters['fromId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: fromId'));
            return deferred.promise;
        }
 

                if(parameters['fromType'] !== undefined){
                    queryParameters['fromType'] = parameters['fromType'];
                }
        
        
        


        if(parameters['fromType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: fromType'));
            return deferred.promise;
        }
 

                if(parameters['relationType'] !== undefined){
                    queryParameters['relationType'] = parameters['relationType'];
                }
        
        
        


        if(parameters['relationType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: relationType'));
            return deferred.promise;
        }
 

                if(parameters['relationTypeGroup'] !== undefined){
                    queryParameters['relationTypeGroup'] = parameters['relationTypeGroup'];
                }
        
        
        


 

                if(parameters['toId'] !== undefined){
                    queryParameters['toId'] = parameters['toId'];
                }
        
        
        


        if(parameters['toId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: toId'));
            return deferred.promise;
        }
 

                if(parameters['toType'] !== undefined){
                    queryParameters['toType'] = parameters['toType'];
                }
        
        
        


        if(parameters['toType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: toType'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Deletes a relation between two entities in the platform. 

If the user has the authority of 'System Administrator', the server checks that 'from' and 'to' entities are owned by the sysadmin. If the user has the authority of 'Tenant Administrator', the server checks that 'from' and 'to' entities are owned by the same tenant. If the user has the authority of 'Customer User', the server checks that the 'from' and 'to' entities are assigned to the same customer.
 * @method
 * @name ThingsboardRestApi#deleteRelationUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.fromId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.fromType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.relationType - A string value representing relation type between entities. For example, 'Contains', 'Manages'. It can be any string value.
     * @param {string} parameters.relationTypeGroup - A string value representing relation type group. For example, 'COMMON'
     * @param {string} parameters.toId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.toType - A string value representing the entity type. For example, 'DEVICE'
 */
 ThingsboardRestApi.prototype.deleteRelationUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/relation{?fromId,fromType,relationType,relationTypeGroup,toId,toType}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['fromId'] !== undefined){
                    queryParameters['fromId'] = parameters['fromId'];
                }
        
        
        


        if(parameters['fromId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: fromId'));
            return deferred.promise;
        }
 

                if(parameters['fromType'] !== undefined){
                    queryParameters['fromType'] = parameters['fromType'];
                }
        
        
        


        if(parameters['fromType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: fromType'));
            return deferred.promise;
        }
 

                if(parameters['relationType'] !== undefined){
                    queryParameters['relationType'] = parameters['relationType'];
                }
        
        
        


        if(parameters['relationType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: relationType'));
            return deferred.promise;
        }
 

                if(parameters['relationTypeGroup'] !== undefined){
                    queryParameters['relationTypeGroup'] = parameters['relationTypeGroup'];
                }
        
        
        


 

                if(parameters['toId'] !== undefined){
                    queryParameters['toId'] = parameters['toId'];
                }
        
        
        


        if(parameters['toId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: toId'));
            return deferred.promise;
        }
 

                if(parameters['toType'] !== undefined){
                    queryParameters['toType'] = parameters['toType'];
                }
        
        
        


        if(parameters['toType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: toType'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Clears assignment of the Entity View to customer. Customer will not be able to query Entity View afterwards.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#unassignEntityViewFromCustomerUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityViewId - A string value representing the entity view id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.unassignEntityViewFromCustomerUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/entityView/{entityViewId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{entityViewId}', parameters['entityViewId']);
        
        


        if(parameters['entityViewId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityViewId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Entity View will be available for non-authorized (not logged-in) users. This is useful to create dashboards that you plan to share/embed on a publicly available website. However, users that are logged-in and belong to different tenant will not be able to access the entity view.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#assignEntityViewToPublicCustomerUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityViewId - A string value representing the entity view id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.assignEntityViewToPublicCustomerUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/public/entityView/{entityViewId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{entityViewId}', parameters['entityViewId']);
        
        


        if(parameters['entityViewId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityViewId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Creates assignment of the Entity View to customer. Customer will be able to query Entity View afterwards.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#assignEntityViewToCustomerUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.customerId - A string value representing the customer id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.entityViewId - A string value representing the entity view id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.assignEntityViewToCustomerUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/{customerId}/entityView/{entityViewId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{customerId}', parameters['customerId']);
        
        


        if(parameters['customerId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: customerId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{entityViewId}', parameters['entityViewId']);
        
        


        if(parameters['entityViewId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityViewId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of Entity View info objects assigned to customer. Entity Views limit the degree of exposure of the Device or Asset telemetry and attributes to the Customers. Every Entity View references exactly one entity (device or asset) and defines telemetry and attribute keys that will be visible to the assigned Customer. As a Tenant Administrator you are able to create multiple EVs per Device or Asset and assign them to different Customers. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getCustomerEntityViewInfosUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.customerId - A string value representing the customer id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.type - 

## Entity View Filter

Allows to filter entity views based on their type and the **'starts with'** expression over their name. For example, this entity filter selects all 'Concrete Mixer' entity views which name starts with 'CAT':

```json
{
  "type": "entityViewType",
  "entityViewType": "Concrete Mixer",
  "entityViewNameFilter": "CAT"
}
```
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the entity view name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getCustomerEntityViewInfosUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/{customerId}/entityViewInfos{?page,pageSize,sortOrder,sortProperty,textSearch,type}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{customerId}', parameters['customerId']);
        
        


        if(parameters['customerId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: customerId'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['type'] !== undefined){
                    queryParameters['type'] = parameters['type'];
                }
        
        
        


 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of Entity View objects assigned to customer. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getCustomerEntityViewsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.customerId - A string value representing the customer id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.type - 

## Entity View Filter

Allows to filter entity views based on their type and the **'starts with'** expression over their name. For example, this entity filter selects all 'Concrete Mixer' entity views which name starts with 'CAT':

```json
{
  "type": "entityViewType",
  "entityViewType": "Concrete Mixer",
  "entityViewNameFilter": "CAT"
}
```
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the entity view name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getCustomerEntityViewsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/{customerId}/entityViews{?page,pageSize,sortOrder,sortProperty,textSearch,type}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{customerId}', parameters['customerId']);
        
        


        if(parameters['customerId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: customerId'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['type'] !== undefined){
                    queryParameters['type'] = parameters['type'];
                }
        
        
        


 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Creates assignment of an existing entity view to an instance of The Edge. Assignment works in async way - first, notification event pushed to edge service queue on platform. Second, remote edge service will receive a copy of assignment entity view (Edge will receive this instantly, if it's currently connected, or once it's going to be connected to platform). Third, once entity view will be delivered to edge service, it's going to be available for usage on remote edge instance.
 * @method
 * @name ThingsboardRestApi#assignEntityViewToEdgeUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeId - edgeId
     * @param {string} parameters.entityViewId - entityViewId
 */
 ThingsboardRestApi.prototype.assignEntityViewToEdgeUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge/{edgeId}/entityView/{entityViewId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{entityViewId}', parameters['entityViewId']);
        
        


        if(parameters['entityViewId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityViewId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Clears assignment of the entity view to the edge. Unassignment works in async way - first, 'unassign' notification event pushed to edge queue on platform. Second, remote edge service will receive an 'unassign' command to remove entity view (Edge will receive this instantly, if it's currently connected, or once it's going to be connected to platform). Third, once 'unassign' command will be delivered to edge service, it's going to remove entity view locally.
 * @method
 * @name ThingsboardRestApi#unassignEntityViewFromEdgeUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeId - edgeId
     * @param {string} parameters.entityViewId - entityViewId
 */
 ThingsboardRestApi.prototype.unassignEntityViewFromEdgeUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge/{edgeId}/entityView/{entityViewId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{entityViewId}', parameters['entityViewId']);
        
        


        if(parameters['entityViewId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityViewId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * getEdgeEntityViews
 * @method
 * @name ThingsboardRestApi#getEdgeEntityViewsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeId - edgeId
     * @param {string} parameters.page - page
     * @param {string} parameters.pageSize - pageSize
     * @param {string} parameters.type - type
     * @param {string} parameters.textSearch - textSearch
     * @param {string} parameters.sortProperty - sortProperty
     * @param {string} parameters.sortOrder - sortOrder
     * @param {integer} parameters.startTime - startTime
     * @param {integer} parameters.endTime - endTime
 */
 ThingsboardRestApi.prototype.getEdgeEntityViewsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge/{edgeId}/entityViews{?endTime,page,pageSize,sortOrder,sortProperty,startTime,textSearch,type}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['type'] !== undefined){
                    queryParameters['type'] = parameters['type'];
                }
        
        
        


 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 

                if(parameters['startTime'] !== undefined){
                    queryParameters['startTime'] = parameters['startTime'];
                }
        
        
        


 

                if(parameters['endTime'] !== undefined){
                    queryParameters['endTime'] = parameters['endTime'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Entity Views limit the degree of exposure of the Device or Asset telemetry and attributes to the Customers. Every Entity View references exactly one entity (device or asset) and defines telemetry and attribute keys that will be visible to the assigned Customer. As a Tenant Administrator you are able to create multiple EVs per Device or Asset and assign them to different Customers. See the 'Model' tab for more details.
 * @method
 * @name ThingsboardRestApi#saveEntityViewUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveEntityViewUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/entityView';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the Entity View info object based on the provided Entity View Id. Entity Views Info extends the Entity View with customer title and 'is public' flag. Entity Views limit the degree of exposure of the Device or Asset telemetry and attributes to the Customers. Every Entity View references exactly one entity (device or asset) and defines telemetry and attribute keys that will be visible to the assigned Customer. As a Tenant Administrator you are able to create multiple EVs per Device or Asset and assign them to different Customers. See the 'Model' tab for more details.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getEntityViewInfoByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityViewId - A string value representing the entity view id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getEntityViewInfoByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/entityView/info/{entityViewId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{entityViewId}', parameters['entityViewId']);
        
        


        if(parameters['entityViewId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityViewId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a set of unique entity view types based on entity views that are either owned by the tenant or assigned to the customer which user is performing the request.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getEntityViewTypesUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.getEntityViewTypesUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/entityView/types';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the EntityView object based on the provided entity view id. Entity Views limit the degree of exposure of the Device or Asset telemetry and attributes to the Customers. Every Entity View references exactly one entity (device or asset) and defines telemetry and attribute keys that will be visible to the assigned Customer. As a Tenant Administrator you are able to create multiple EVs per Device or Asset and assign them to different Customers. See the 'Model' tab for more details.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getEntityViewByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityViewId - A string value representing the entity view id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getEntityViewByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/entityView/{entityViewId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{entityViewId}', parameters['entityViewId']);
        
        


        if(parameters['entityViewId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityViewId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Delete the EntityView object based on the provided entity view id. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#deleteEntityViewUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityViewId - A string value representing the entity view id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.deleteEntityViewUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/entityView/{entityViewId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{entityViewId}', parameters['entityViewId']);
        
        


        if(parameters['entityViewId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityViewId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns all entity views that are related to the specific entity. The entity id, relation type, entity view types, depth of the search, and other query parameters defined using complex 'EntityViewSearchQuery' object. See 'Model' tab of the Parameters for more info.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#findByQueryUsingPOST_4
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.findByQueryUsingPOST_4 = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/entityViews';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of entity views info owned by tenant. Entity Views limit the degree of exposure of the Device or Asset telemetry and attributes to the Customers. Every Entity View references exactly one entity (device or asset) and defines telemetry and attribute keys that will be visible to the assigned Customer. As a Tenant Administrator you are able to create multiple EVs per Device or Asset and assign them to different Customers. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantEntityViewInfosUsingGET
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.type - 

## Entity View Filter

Allows to filter entity views based on their type and the **'starts with'** expression over their name. For example, this entity filter selects all 'Concrete Mixer' entity views which name starts with 'CAT':

```json
{
  "type": "entityViewType",
  "entityViewType": "Concrete Mixer",
  "entityViewNameFilter": "CAT"
}
```
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the entity view name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getTenantEntityViewInfosUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenant/entityViewInfos{?page,pageSize,sortOrder,sortProperty,textSearch,type}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['type'] !== undefined){
                    queryParameters['type'] = parameters['type'];
                }
        
        
        


 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the Entity View object based on the tenant id and entity view name. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantEntityViewUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityViewName - Entity View name
 */
 ThingsboardRestApi.prototype.getTenantEntityViewUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenant/entityViews{?entityViewName}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['entityViewName'] !== undefined){
                    queryParameters['entityViewName'] = parameters['entityViewName'];
                }
        
        
        


        if(parameters['entityViewName'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityViewName'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of entity views owned by tenant. Entity Views limit the degree of exposure of the Device or Asset telemetry and attributes to the Customers. Every Entity View references exactly one entity (device or asset) and defines telemetry and attribute keys that will be visible to the assigned Customer. As a Tenant Administrator you are able to create multiple EVs per Device or Asset and assign them to different Customers. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantEntityViewsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.type - 

## Entity View Filter

Allows to filter entity views based on their type and the **'starts with'** expression over their name. For example, this entity filter selects all 'Concrete Mixer' entity views which name starts with 'CAT':

```json
{
  "type": "entityViewType",
  "entityViewType": "Concrete Mixer",
  "entityViewNameFilter": "CAT"
}
```
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the entity view name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getTenantEntityViewsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenant/entityViews{?page,pageSize,sortOrder,sortProperty,textSearch,type}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['type'] !== undefined){
                    queryParameters['type'] = parameters['type'];
                }
        
        
        


 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Clears events by filter for specified entity.
 * @method
 * @name ThingsboardRestApi#clearEventsUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.entityId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.startTime - Timestamp. Events with creation time before it won't be queried.
     * @param {integer} parameters.endTime - Timestamp. Events with creation time after it won't be queried.
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.clearEventsUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/events/{entityType}/{entityId}/clear{?endTime,startTime}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
            path = path.replace('{entityType}', parameters['entityType']);
        
        


        if(parameters['entityType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityType'));
            return deferred.promise;
        }
 
        
            path = path.replace('{entityId}', parameters['entityId']);
        
        


        if(parameters['entityId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityId'));
            return deferred.promise;
        }
 

                if(parameters['startTime'] !== undefined){
                    queryParameters['startTime'] = parameters['startTime'];
                }
        
        
        


 

                if(parameters['endTime'] !== undefined){
                    queryParameters['endTime'] = parameters['endTime'];
                }
        
        
        


 
        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of events for specified entity by specifying event type. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 
 * @method
 * @name ThingsboardRestApi#getEventsUsingGET_1
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.entityId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.eventType - A string value representing event type
     * @param {string} parameters.tenantId - A string value representing the tenant id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The value is not used in searching.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
     * @param {integer} parameters.startTime - Timestamp. Events with creation time before it won't be queried.
     * @param {integer} parameters.endTime - Timestamp. Events with creation time after it won't be queried.
 */
 ThingsboardRestApi.prototype.getEventsUsingGET_1 = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/events/{entityType}/{entityId}/{eventType}{?endTime,page,pageSize,sortOrder,sortProperty,startTime,tenantId,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{entityType}', parameters['entityType']);
        
        


        if(parameters['entityType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityType'));
            return deferred.promise;
        }
 
        
            path = path.replace('{entityId}', parameters['entityId']);
        
        


        if(parameters['entityId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{eventType}', parameters['eventType']);
        
        


        if(parameters['eventType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: eventType'));
            return deferred.promise;
        }
 

                if(parameters['tenantId'] !== undefined){
                    queryParameters['tenantId'] = parameters['tenantId'];
                }
        
        
        


        if(parameters['tenantId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 

                if(parameters['startTime'] !== undefined){
                    queryParameters['startTime'] = parameters['startTime'];
                }
        
        
        


 

                if(parameters['endTime'] !== undefined){
                    queryParameters['endTime'] = parameters['endTime'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of events for specified entity. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 
 * @method
 * @name ThingsboardRestApi#getEventsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.entityId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.tenantId - A string value representing the tenant id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The value is not used in searching.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
     * @param {integer} parameters.startTime - Timestamp. Events with creation time before it won't be queried.
     * @param {integer} parameters.endTime - Timestamp. Events with creation time after it won't be queried.
 */
 ThingsboardRestApi.prototype.getEventsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/events/{entityType}/{entityId}{?endTime,page,pageSize,sortOrder,sortProperty,startTime,tenantId,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{entityType}', parameters['entityType']);
        
        


        if(parameters['entityType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityType'));
            return deferred.promise;
        }
 
        
            path = path.replace('{entityId}', parameters['entityId']);
        
        


        if(parameters['entityId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityId'));
            return deferred.promise;
        }
 

                if(parameters['tenantId'] !== undefined){
                    queryParameters['tenantId'] = parameters['tenantId'];
                }
        
        
        


        if(parameters['tenantId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 

                if(parameters['startTime'] !== undefined){
                    queryParameters['startTime'] = parameters['startTime'];
                }
        
        
        


 

                if(parameters['endTime'] !== undefined){
                    queryParameters['endTime'] = parameters['endTime'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of events for the chosen entity by specifying the event filter. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

# Event Filter Definition

5 different eventFilter objects could be set for different event types. The eventType field is required. Others are optional. If some of them are set, the filtering will be applied according to them. See the examples below for all the fields used for each event type filtering. 

Note,

 * 'server' - string value representing the server name, identifier or ip address where the platform is running;
 * 'errorStr' - the case insensitive 'contains' filter based on error message.

## Error Event Filter

```json
{
   "eventType":"ERROR",
   "server":"ip-172-31-24-152",
   "method":"onClusterEventMsg",
   "errorStr":"Error Message"
}
```

 * 'method' - string value representing the method name when the error happened.

## Lifecycle Event Filter

```json
{
   "eventType":"LC_EVENT",
   "server":"ip-172-31-24-152",
   "event":"STARTED",
   "status":"Success",
   "errorStr":"Error Message"
}
```

 * 'event' - string value representing the lifecycle event type;
 * 'status' - string value representing status of the lifecycle event.

## Statistics Event Filter

```json
{
   "eventType":"STATS",
   "server":"ip-172-31-24-152",
   "messagesProcessed":10,
   "errorsOccurred":5
}
```

 * 'messagesProcessed' - the minimum number of successfully processed messages;
 * 'errorsOccurred' - the minimum number of errors occurred during messages processing.

## Debug Rule Node Event Filter

```json
{
   "eventType":"DEBUG_RULE_NODE",
   "msgDirectionType":"IN",
   "server":"ip-172-31-24-152",
   "dataSearch":"humidity",
   "metadataSearch":"deviceName",
   "entityName":"DEVICE",
   "relationType":"Success",
   "entityId":"de9d54a0-2b7a-11ec-a3cc-23386423d98f",
   "msgType":"POST_TELEMETRY_REQUEST",
   "isError":"false",
   "errorStr":"Error Message"
}
```

## Debug Rule Chain Event Filter

```json
{
   "eventType":"DEBUG_RULE_CHAIN",
   "msgDirectionType":"IN",
   "server":"ip-172-31-24-152",
   "dataSearch":"humidity",
   "metadataSearch":"deviceName",
   "entityName":"DEVICE",
   "relationType":"Success",
   "entityId":"de9d54a0-2b7a-11ec-a3cc-23386423d98f",
   "msgType":"POST_TELEMETRY_REQUEST",
   "isError":"false",
   "errorStr":"Error Message"
}
```

 * 'msgDirectionType' - string value representing msg direction type (incoming to entity or outcoming from entity);
 * 'dataSearch' - the case insensitive 'contains' filter based on data (key and value) for the message;
 * 'metadataSearch' - the case insensitive 'contains' filter based on metadata (key and value) for the message;
 * 'entityName' - string value representing the entity type;
 * 'relationType' - string value representing the type of message routing;
 * 'entityId' - string value representing the entity id in the event body (originator of the message);
 * 'msgType' - string value representing the message type;
 * 'isError' - boolean value to filter the errors.


 * @method
 * @name ThingsboardRestApi#getEventsUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.entityId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.tenantId - A string value representing the tenant id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The value is not used in searching.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
     * @param {integer} parameters.startTime - Timestamp. Events with creation time before it won't be queried.
     * @param {integer} parameters.endTime - Timestamp. Events with creation time after it won't be queried.
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.getEventsUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/events/{entityType}/{entityId}{?endTime,page,pageSize,sortOrder,sortProperty,startTime,tenantId,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
            path = path.replace('{entityType}', parameters['entityType']);
        
        


        if(parameters['entityType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityType'));
            return deferred.promise;
        }
 
        
            path = path.replace('{entityId}', parameters['entityId']);
        
        


        if(parameters['entityId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityId'));
            return deferred.promise;
        }
 

                if(parameters['tenantId'] !== undefined){
                    queryParameters['tenantId'] = parameters['tenantId'];
                }
        
        
        


        if(parameters['tenantId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 

                if(parameters['startTime'] !== undefined){
                    queryParameters['startTime'] = parameters['startTime'];
                }
        
        
        


 

                if(parameters['endTime'] !== undefined){
                    queryParameters['endTime'] = parameters['endTime'];
                }
        
        
        


 
        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Get the Lwm2m Bootstrap SecurityInfo object (of the current server) based on the provided isBootstrapServer parameter. If isBootstrapServer == true, get the parameters of the current Bootstrap Server. If isBootstrapServer == false, get the parameters of the current Lwm2m Server. Used for client settings when starting the client in Bootstrap mode. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getLwm2mBootstrapSecurityInfoUsingGET
 * @param {object} parameters - method options and parameters
     * @param {boolean} parameters.isBootstrapServer - A Boolean value representing the Server SecurityInfo for future Bootstrap client mode settings. Values: 'true' for Bootstrap Server; 'false' for Lwm2m Server. 
 */
 ThingsboardRestApi.prototype.getLwm2mBootstrapSecurityInfoUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/lwm2m/deviceProfile/bootstrap/{isBootstrapServer}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{isBootstrapServer}', parameters['isBootstrapServer']);
        
        


        if(parameters['isBootstrapServer'] === undefined){
            deferred.reject(new Error('Missing required  parameter: isBootstrapServer'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Client registration template is OAuth2 provider configuration template with default settings for registering new OAuth2 clients
 * @method
 * @name ThingsboardRestApi#getClientRegistrationTemplatesUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.getClientRegistrationTemplatesUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/oauth2/config/template';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Client registration template is OAuth2 provider configuration template with default settings for registering new OAuth2 clients
 * @method
 * @name ThingsboardRestApi#saveClientRegistrationTemplateUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveClientRegistrationTemplateUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/oauth2/config/template';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Client registration template is OAuth2 provider configuration template with default settings for registering new OAuth2 clients
 * @method
 * @name ThingsboardRestApi#deleteClientRegistrationTemplateUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.clientRegistrationTemplateId - String representation of client registration template id to delete
 */
 ThingsboardRestApi.prototype.deleteClientRegistrationTemplateUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/oauth2/config/template/{clientRegistrationTemplateId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{clientRegistrationTemplateId}', parameters['clientRegistrationTemplateId']);
        
        


        if(parameters['clientRegistrationTemplateId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: clientRegistrationTemplateId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Get the list of OAuth2 clients to log in with, available for such domain scheme (HTTP or HTTPS) (if x-forwarded-proto request header is present - the scheme is known from it) and domain name and port (port may be known from x-forwarded-port header)
 * @method
 * @name ThingsboardRestApi#getOAuth2ClientsUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.pkgName - Mobile application package name, to find OAuth2 clients where there is configured mobile application with such package name
     * @param {string} parameters.platform - Platform type to search OAuth2 clients for which the usage with this platform type is allowed in the settings. If platform type is not one of allowable values - it will just be ignored
 */
 ThingsboardRestApi.prototype.getOAuth2ClientsUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/noauth/oauth2Clients{?pkgName,platform}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers['Accept'] = ['application/json'];


                if(parameters['pkgName'] !== undefined){
                    queryParameters['pkgName'] = parameters['pkgName'];
                }
        
        
        


 

                if(parameters['platform'] !== undefined){
                    queryParameters['platform'] = parameters['platform'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * 

Available for users with 'SYS_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getCurrentOAuth2InfoUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.getCurrentOAuth2InfoUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/oauth2/config';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * 

Available for users with 'SYS_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#saveOAuth2InfoUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveOAuth2InfoUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/oauth2/config';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns the URL enclosed in double quotes. After successful authentication with OAuth2 provider, it makes a redirect to this path so that the platform can do further log in processing. This URL may be configured as 'security.oauth2.loginProcessingUrl' property in yml configuration file, or as 'SECURITY_OAUTH2_LOGIN_PROCESSING_URL' env variable. By default it is '/login/oauth2/code/'

Available for users with 'SYS_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getLoginProcessingUrlUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.getLoginProcessingUrlUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/oauth2/loginProcessingUrl';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Create or update the OTA Package Info. When creating OTA Package Info, platform generates OTA Package id as [time-based UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_1_(date-time_and_MAC_address)). The newly created OTA Package id will be present in the response. Specify existing OTA Package id to update the OTA Package Info. Referencing non-existing OTA Package Id will cause 'Not Found' error. 

OTA Package combination of the title with the version is unique in the scope of tenant. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#saveOtaPackageInfoUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveOtaPackageInfoUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/otaPackage';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the OTA Package Info object based on the provided OTA Package Id. OTA Package Info is a lightweight object that includes main information about the OTA Package excluding the heavyweight data. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getOtaPackageInfoByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.otaPackageId - A string value representing the ota package id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getOtaPackageInfoByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/otaPackage/info/{otaPackageId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{otaPackageId}', parameters['otaPackageId']);
        
        


        if(parameters['otaPackageId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: otaPackageId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the OTA Package object based on the provided OTA Package Id. The server checks that the OTA Package is owned by the same tenant. OTA Package is a heavyweight object that includes main information about the OTA Package and also data. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getOtaPackageByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.otaPackageId - A string value representing the ota package id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getOtaPackageByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/otaPackage/{otaPackageId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{otaPackageId}', parameters['otaPackageId']);
        
        


        if(parameters['otaPackageId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: otaPackageId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Deletes the OTA Package. Referencing non-existing OTA Package Id will cause an error. Can't delete the OTA Package if it is referenced by existing devices or device profile.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#deleteOtaPackageUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.otaPackageId - A string value representing the ota package id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.deleteOtaPackageUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/otaPackage/{otaPackageId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{otaPackageId}', parameters['otaPackageId']);
        
        


        if(parameters['otaPackageId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: otaPackageId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Download OTA Package based on the provided OTA Package Id.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#downloadOtaPackageUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.otaPackageId - A string value representing the ota package id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.downloadOtaPackageUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/otaPackage/{otaPackageId}/download';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{otaPackageId}', parameters['otaPackageId']);
        
        


        if(parameters['otaPackageId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: otaPackageId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Update the OTA Package. Adds the date to the existing OTA Package Info

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#saveOtaPackageDataUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.otaPackageId - A string value representing the ota package id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.checksum - OTA Package checksum. For example, '0xd87f7e0c'
     * @param {string} parameters.checksumAlgorithm - OTA Package checksum algorithm.
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveOtaPackageDataUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/otaPackage/{otaPackageId}{?checksum,checksumAlgorithm}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
            path = path.replace('{otaPackageId}', parameters['otaPackageId']);
        
        


        if(parameters['otaPackageId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: otaPackageId'));
            return deferred.promise;
        }
 

                if(parameters['checksum'] !== undefined){
                    queryParameters['checksum'] = parameters['checksum'];
                }
        
        
        


 

                if(parameters['checksumAlgorithm'] !== undefined){
                    queryParameters['checksumAlgorithm'] = parameters['checksumAlgorithm'];
                }
        
        
        


        if(parameters['checksumAlgorithm'] === undefined){
            deferred.reject(new Error('Missing required  parameter: checksumAlgorithm'));
            return deferred.promise;
        }
 
        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of OTA Package Info objects owned by tenant. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. OTA Package Info is a lightweight object that includes main information about the OTA Package excluding the heavyweight data. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getOtaPackagesUsingGET_1
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.deviceProfileId - A string value representing the device profile id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.type - OTA Package type.
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the ota package title.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getOtaPackagesUsingGET_1 = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/otaPackages/{deviceProfileId}/{type}{?page,pageSize,sortOrder,sortProperty,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{deviceProfileId}', parameters['deviceProfileId']);
        
        


        if(parameters['deviceProfileId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceProfileId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{type}', parameters['type']);
        
        


        if(parameters['type'] === undefined){
            deferred.reject(new Error('Missing required  parameter: type'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of OTA Package Info objects owned by tenant. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. OTA Package Info is a lightweight object that includes main information about the OTA Package excluding the heavyweight data. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getOtaPackagesUsingGET
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the ota package title.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getOtaPackagesUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/otaPackages{?page,pageSize,sortOrder,sortProperty,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a set of unique queue names based on service type. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantQueuesByServiceTypeUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.serviceType - Service type (implemented only for the TB-RULE-ENGINE)
 */
 ThingsboardRestApi.prototype.getTenantQueuesByServiceTypeUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenant/queues{?serviceType}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['serviceType'] !== undefined){
                    queryParameters['serviceType'] = parameters['serviceType'];
                }
        
        
        


        if(parameters['serviceType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: serviceType'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Deprecated. See 'Rpc V 2 Controller' instead.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#handleOneWayDeviceRPCRequestUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.deviceId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.handleOneWayDeviceRPCRequestUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/plugins/rpc/oneway/{deviceId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
            path = path.replace('{deviceId}', parameters['deviceId']);
        
        


        if(parameters['deviceId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceId'));
            return deferred.promise;
        }
 
        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Deprecated. See 'Rpc V 2 Controller' instead.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#handleTwoWayDeviceRPCRequestUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.deviceId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.handleTwoWayDeviceRPCRequestUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/plugins/rpc/twoway/{deviceId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
            path = path.replace('{deviceId}', parameters['deviceId']);
        
        


        if(parameters['deviceId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceId'));
            return deferred.promise;
        }
 
        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Sends the one-way remote-procedure call (RPC) request to device. Sends the one-way remote-procedure call (RPC) request to device. The RPC call is A JSON that contains the method name ('method'), parameters ('params') and multiple optional fields. See example below. We will review the properties of the RPC call one-by-one below. 

```json
{
  "method": "setGpio",
  "params": {
    "pin": 7,
    "value": 1
  },
  "persistent": false,
  "timeout": 5000
}
```

### Server-side RPC structure

The body of server-side RPC request consists of multiple fields:

* **method** - mandatory, name of the method to distinct the RPC calls.
  For example, "getCurrentTime" or "getWeatherForecast". The value of the parameter is a string.
* **params** - mandatory, parameters used for processing of the request. The value is a JSON. Leave empty JSON "{}" if no parameters needed.
* **timeout** - optional, value of the processing timeout in milliseconds. The default value is 10000 (10 seconds). The minimum value is 5000 (5 seconds).
* **expirationTime** - optional, value of the epoch time (in milliseconds, UTC timezone). Overrides **timeout** if present.
* **persistent** - optional, indicates persistent RPC. The default value is "false".
* **retries** - optional, defines how many times persistent RPC will be re-sent in case of failures on the network and/or device side.
* **additionalInfo** - optional, defines metadata for the persistent RPC that will be added to the persistent RPC events.

### RPC Result
In case of persistent RPC, the result of this call is 'rpcId' UUID. In case of lightweight RPC, the result of this call is either 200 OK if the message was sent to device, or 504 Gateway Timeout if device is offline.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#handleOneWayDeviceRPCRequestUsingPOST_1
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.deviceId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.handleOneWayDeviceRPCRequestUsingPOST_1 = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/rpc/oneway/{deviceId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
            path = path.replace('{deviceId}', parameters['deviceId']);
        
        


        if(parameters['deviceId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceId'));
            return deferred.promise;
        }
 
        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Allows to query RPC calls for specific device using pagination.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getPersistedRpcByDeviceUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.deviceId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.rpcStatus - Status of the RPC
     * @param {string} parameters.textSearch - Not implemented. Leave empty.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getPersistedRpcByDeviceUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/rpc/persistent/device/{deviceId}{?page,pageSize,rpcStatus,sortOrder,sortProperty,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{deviceId}', parameters['deviceId']);
        
        


        if(parameters['deviceId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceId'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['rpcStatus'] !== undefined){
                    queryParameters['rpcStatus'] = parameters['rpcStatus'];
                }
        
        
        


 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Get information about the status of the RPC call.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getPersistedRpcUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.rpcId - A string value representing the rpc id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getPersistedRpcUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/rpc/persistent/{rpcId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{rpcId}', parameters['rpcId']);
        
        


        if(parameters['rpcId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: rpcId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Deletes the persistent RPC request.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#deleteRpcUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.rpcId - A string value representing the rpc id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.deleteRpcUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/rpc/persistent/{rpcId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{rpcId}', parameters['rpcId']);
        
        


        if(parameters['rpcId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: rpcId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Sends the two-way remote-procedure call (RPC) request to device. Sends the one-way remote-procedure call (RPC) request to device. The RPC call is A JSON that contains the method name ('method'), parameters ('params') and multiple optional fields. See example below. We will review the properties of the RPC call one-by-one below. 

```json
{
  "method": "setGpio",
  "params": {
    "pin": 7,
    "value": 1
  },
  "persistent": false,
  "timeout": 5000
}
```

### Server-side RPC structure

The body of server-side RPC request consists of multiple fields:

* **method** - mandatory, name of the method to distinct the RPC calls.
  For example, "getCurrentTime" or "getWeatherForecast". The value of the parameter is a string.
* **params** - mandatory, parameters used for processing of the request. The value is a JSON. Leave empty JSON "{}" if no parameters needed.
* **timeout** - optional, value of the processing timeout in milliseconds. The default value is 10000 (10 seconds). The minimum value is 5000 (5 seconds).
* **expirationTime** - optional, value of the epoch time (in milliseconds, UTC timezone). Overrides **timeout** if present.
* **persistent** - optional, indicates persistent RPC. The default value is "false".
* **retries** - optional, defines how many times persistent RPC will be re-sent in case of failures on the network and/or device side.
* **additionalInfo** - optional, defines metadata for the persistent RPC that will be added to the persistent RPC events.

### RPC Result
In case of persistent RPC, the result of this call is 'rpcId' UUID. In case of lightweight RPC, the result of this call is the response from device, or 504 Gateway Timeout if device is offline.

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#handleTwoWayDeviceRPCRequestUsingPOST_1
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.deviceId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.handleTwoWayDeviceRPCRequestUsingPOST_1 = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/rpc/twoway/{deviceId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
            path = path.replace('{deviceId}', parameters['deviceId']);
        
        


        if(parameters['deviceId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceId'));
            return deferred.promise;
        }
 
        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Creates assignment of an existing rule chain to an instance of The Edge. Assignment works in async way - first, notification event pushed to edge service queue on platform. Second, remote edge service will receive a copy of assignment rule chain (Edge will receive this instantly, if it's currently connected, or once it's going to be connected to platform). Third, once rule chain will be delivered to edge service, it's going to start processing messages locally. 

Only rule chain with type 'EDGE' can be assigned to edge.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#assignRuleChainToEdgeUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeId - edgeId
     * @param {string} parameters.ruleChainId - ruleChainId
 */
 ThingsboardRestApi.prototype.assignRuleChainToEdgeUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge/{edgeId}/ruleChain/{ruleChainId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{ruleChainId}', parameters['ruleChainId']);
        
        


        if(parameters['ruleChainId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: ruleChainId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Clears assignment of the rule chain to the edge. Unassignment works in async way - first, 'unassign' notification event pushed to edge queue on platform. Second, remote edge service will receive an 'unassign' command to remove rule chain (Edge will receive this instantly, if it's currently connected, or once it's going to be connected to platform). Third, once 'unassign' command will be delivered to edge service, it's going to remove rule chain locally.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#unassignRuleChainFromEdgeUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeId - edgeId
     * @param {string} parameters.ruleChainId - ruleChainId
 */
 ThingsboardRestApi.prototype.unassignRuleChainFromEdgeUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge/{edgeId}/ruleChain/{ruleChainId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{ruleChainId}', parameters['ruleChainId']);
        
        


        if(parameters['ruleChainId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: ruleChainId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of Rule Chains assigned to the specified edge. The rule chain object is lightweight and contains general information about the rule chain. List of rule nodes and their connection is stored in a separate 'metadata' object.You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getEdgeRuleChainsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.edgeId - A string value representing the edge id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the rule chain name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getEdgeRuleChainsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/edge/{edgeId}/ruleChains{?page,pageSize,sortOrder,sortProperty,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{edgeId}', parameters['edgeId']);
        
        


        if(parameters['edgeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: edgeId'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Create or update the Rule Chain. When creating Rule Chain, platform generates Rule Chain Id as [time-based UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_1_(date-time_and_MAC_address)). The newly created Rule Chain Id will be present in the response. Specify existing Rule Chain id to update the rule chain. Referencing non-existing rule chain Id will cause 'Not Found' error.

The rule chain object is lightweight and contains general information about the rule chain. List of rule nodes and their connection is stored in a separate 'metadata' object.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#saveRuleChainUsingPOST_1
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveRuleChainUsingPOST_1 = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/ruleChain';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a list of Rule Chains that will be assigned to a newly created edge. The rule chain object is lightweight and contains general information about the rule chain. List of rule nodes and their connection is stored in a separate 'metadata' object.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getAutoAssignToEdgeRuleChainsUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.getAutoAssignToEdgeRuleChainsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/ruleChain/autoAssignToEdgeRuleChains';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Create rule chain from template, based on the specified name in the request. Creates the rule chain based on the template that is used to create root rule chain. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#saveRuleChainUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveRuleChainUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/ruleChain/device/default';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Updates the rule chain metadata. The metadata object contains information about the rule nodes and their connections.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#saveRuleChainMetaDataUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {boolean} parameters.updateRelated - Update related rule nodes.
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveRuleChainMetaDataUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/ruleChain/metadata{?updateRelated}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];


                if(parameters['updateRelated'] !== undefined){
                    queryParameters['updateRelated'] = parameters['updateRelated'];
                }
        
        
        


 
        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Execute the JavaScript function and return the result. The format of request: 

```json
{
  "script": "Your JS Function as String",
  "scriptType": "One of: update, generate, filter, switch, json, string",
  "argNames": ["msg", "metadata", "type"],
  "msg": "{\"temperature\": 42}", 
  "metadata": {
    "deviceName": "Device A",
    "deviceType": "Thermometer"
  },
  "msgType": "POST_TELEMETRY_REQUEST"
}
```

 Expected result JSON contains "output" and "error".

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#testScriptUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.testScriptUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/ruleChain/testScript';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the Rule Chain object based on the provided Rule Chain Id. The rule chain object is lightweight and contains general information about the rule chain. List of rule nodes and their connection is stored in a separate 'metadata' object.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getRuleChainByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.ruleChainId - A string value representing the rule chain id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getRuleChainByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/ruleChain/{ruleChainId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{ruleChainId}', parameters['ruleChainId']);
        
        


        if(parameters['ruleChainId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: ruleChainId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Deletes the rule chain. Referencing non-existing rule chain Id will cause an error. Referencing rule chain that is used in the device profiles will cause an error.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#deleteRuleChainUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.ruleChainId - A string value representing the rule chain id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.deleteRuleChainUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/ruleChain/{ruleChainId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{ruleChainId}', parameters['ruleChainId']);
        
        


        if(parameters['ruleChainId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: ruleChainId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Makes the rule chain to be automatically assigned for any new edge that will be created. Does not assign this rule chain for already created edges. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#setAutoAssignToEdgeRuleChainUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.ruleChainId - A string value representing the rule chain id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.setAutoAssignToEdgeRuleChainUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/ruleChain/{ruleChainId}/autoAssignToEdge';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{ruleChainId}', parameters['ruleChainId']);
        
        


        if(parameters['ruleChainId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: ruleChainId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Removes the rule chain from the list of rule chains that are going to be automatically assigned for any new edge that will be created. Does not unassign this rule chain for already assigned edges. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#unsetAutoAssignToEdgeRuleChainUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.ruleChainId - A string value representing the rule chain id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.unsetAutoAssignToEdgeRuleChainUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/ruleChain/{ruleChainId}/autoAssignToEdge';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{ruleChainId}', parameters['ruleChainId']);
        
        


        if(parameters['ruleChainId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: ruleChainId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Makes the rule chain to be root rule chain for any new edge that will be created. Does not update root rule chain for already created edges. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#setEdgeTemplateRootRuleChainUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.ruleChainId - A string value representing the rule chain id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.setEdgeTemplateRootRuleChainUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/ruleChain/{ruleChainId}/edgeTemplateRoot';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{ruleChainId}', parameters['ruleChainId']);
        
        


        if(parameters['ruleChainId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: ruleChainId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the Rule Chain Metadata object based on the provided Rule Chain Id. The metadata object contains information about the rule nodes and their connections.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getRuleChainMetaDataUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.ruleChainId - A string value representing the rule chain id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getRuleChainMetaDataUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/ruleChain/{ruleChainId}/metadata';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{ruleChainId}', parameters['ruleChainId']);
        
        


        if(parameters['ruleChainId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: ruleChainId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the unique labels for the "output" Rule Nodes that belong to the Rule Chain based on the provided Rule Chain Id. The rule chain object is lightweight and contains general information about the rule chain. List of rule nodes and their connection is stored in a separate 'metadata' object.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getRuleChainOutputLabelsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.ruleChainId - A string value representing the rule chain id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getRuleChainOutputLabelsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/ruleChain/{ruleChainId}/output/labels';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{ruleChainId}', parameters['ruleChainId']);
        
        


        if(parameters['ruleChainId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: ruleChainId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the list of rule chains and the relation types (labels) they use to process output of the current rule chain based on the provided Rule Chain Id. The rule chain object is lightweight and contains general information about the rule chain. List of rule nodes and their connection is stored in a separate 'metadata' object.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getRuleChainOutputLabelsUsageUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.ruleChainId - A string value representing the rule chain id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getRuleChainOutputLabelsUsageUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/ruleChain/{ruleChainId}/output/labels/usage';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{ruleChainId}', parameters['ruleChainId']);
        
        


        if(parameters['ruleChainId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: ruleChainId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Makes the rule chain to be root rule chain. Updates previous root rule chain as well. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#setRootRuleChainUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.ruleChainId - A string value representing the rule chain id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.setRootRuleChainUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/ruleChain/{ruleChainId}/root';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{ruleChainId}', parameters['ruleChainId']);
        
        


        if(parameters['ruleChainId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: ruleChainId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Exports all tenant rule chains as one JSON.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#exportRuleChainsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.limit - A limit of rule chains to export.
 */
 ThingsboardRestApi.prototype.exportRuleChainsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/ruleChains/export{?limit}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['limit'] !== undefined){
                    queryParameters['limit'] = parameters['limit'];
                }
        
        
        


        if(parameters['limit'] === undefined){
            deferred.reject(new Error('Missing required  parameter: limit'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Imports all tenant rule chains as one JSON.

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#importRuleChainsUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {boolean} parameters.overwrite - Enables overwrite for existing rule chains with the same name.
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.importRuleChainsUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/ruleChains/import{?overwrite}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];


                if(parameters['overwrite'] !== undefined){
                    queryParameters['overwrite'] = parameters['overwrite'];
                }
        
        
        


 
        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of Rule Chains owned by tenant. The rule chain object is lightweight and contains general information about the rule chain. List of rule nodes and their connection is stored in a separate 'metadata' object.You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getRuleChainsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.type - Rule chain type (CORE or EDGE)
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the rule chain name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getRuleChainsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/ruleChains{?page,pageSize,sortOrder,sortProperty,textSearch,type}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['type'] !== undefined){
                    queryParameters['type'] = parameters['type'];
                }
        
        
        


 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Gets the input message from the debug events for specified Rule Chain Id. Referencing non-existing rule chain Id will cause an error. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getLatestRuleNodeDebugInputUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.ruleNodeId - A string value representing the rule node id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getLatestRuleNodeDebugInputUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/ruleNode/{ruleNodeId}/debugIn';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{ruleNodeId}', parameters['ruleNodeId']);
        
        


        if(parameters['ruleNodeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: ruleNodeId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * activateUserByEmailCode
 * @method
 * @name ThingsboardRestApi#activateUserByEmailCodeUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.emailCode - emailCode
     * @param {string} parameters.pkgName - pkgName
 */
 ThingsboardRestApi.prototype.activateUserByEmailCodeUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/noauth/activateByEmailCode{?emailCode,pkgName}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers['Accept'] = ['application/json'];


                if(parameters['emailCode'] !== undefined){
                    queryParameters['emailCode'] = parameters['emailCode'];
                }
        
        
        


        if(parameters['emailCode'] === undefined){
            deferred.reject(new Error('Missing required  parameter: emailCode'));
            return deferred.promise;
        }
 

                if(parameters['pkgName'] !== undefined){
                    queryParameters['pkgName'] = parameters['pkgName'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * activateEmail
 * @method
 * @name ThingsboardRestApi#activateEmailUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.emailCode - emailCode
     * @param {string} parameters.pkgName - pkgName
 */
 ThingsboardRestApi.prototype.activateEmailUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/noauth/activateEmail{?emailCode,pkgName}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers['Accept'] = ['application/json'];


                if(parameters['emailCode'] !== undefined){
                    queryParameters['emailCode'] = parameters['emailCode'];
                }
        
        
        


        if(parameters['emailCode'] === undefined){
            deferred.reject(new Error('Missing required  parameter: emailCode'));
            return deferred.promise;
        }
 

                if(parameters['pkgName'] !== undefined){
                    queryParameters['pkgName'] = parameters['pkgName'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * mobileLogin
 * @method
 * @name ThingsboardRestApi#mobileLoginUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.pkgName - pkgName
 */
 ThingsboardRestApi.prototype.mobileLoginUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/noauth/login{?pkgName}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers['Accept'] = ['application/json'];


                if(parameters['pkgName'] !== undefined){
                    queryParameters['pkgName'] = parameters['pkgName'];
                }
        
        
        


        if(parameters['pkgName'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pkgName'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * resendEmailActivation
 * @method
 * @name ThingsboardRestApi#resendEmailActivationUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.email - email
     * @param {string} parameters.pkgName - pkgName
 */
 ThingsboardRestApi.prototype.resendEmailActivationUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/noauth/resendEmailActivation{?email,pkgName}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers['Accept'] = ['application/json'];


                if(parameters['email'] !== undefined){
                    queryParameters['email'] = parameters['email'];
                }
        
        
        


        if(parameters['email'] === undefined){
            deferred.reject(new Error('Missing required  parameter: email'));
            return deferred.promise;
        }
 

                if(parameters['pkgName'] !== undefined){
                    queryParameters['pkgName'] = parameters['pkgName'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * signUp
 * @method
 * @name ThingsboardRestApi#signUpUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.signUpUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/noauth/signup';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * getRecaptchaPublicKey
 * @method
 * @name ThingsboardRestApi#getRecaptchaPublicKeyUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.getRecaptchaPublicKeyUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/noauth/signup/recaptchaPublicKey';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * acceptPrivacyPolicy
 * @method
 * @name ThingsboardRestApi#acceptPrivacyPolicyUsingPOST
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.acceptPrivacyPolicyUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/signup/acceptPrivacyPolicy';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * privacyPolicyAccepted
 * @method
 * @name ThingsboardRestApi#privacyPolicyAcceptedUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.privacyPolicyAcceptedUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/signup/privacyPolicyAccepted';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * deleteTenantAccount
 * @method
 * @name ThingsboardRestApi#deleteTenantAccountUsingDELETE
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.deleteTenantAccountUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/signup/tenantAccount';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Create or update the Resource. When creating the Resource, platform generates Resource id as [time-based UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_1_(date-time_and_MAC_address)). The newly created Resource id will be present in the response. Specify existing Resource id to update the Resource. Referencing non-existing Resource Id will cause 'Not Found' error. 

Resource combination of the title with the key is unique in the scope of tenant. 

Available for users with 'SYS_ADMIN' or 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#saveResourceUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveResourceUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/resource';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the Resource Info object based on the provided Resource Id. Resource Info is a lightweight object that includes main information about the Resource excluding the heavyweight data. 

Available for users with 'SYS_ADMIN' or 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getResourceInfoByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.resourceId - A string value representing the resource id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getResourceInfoByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/resource/info/{resourceId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{resourceId}', parameters['resourceId']);
        
        


        if(parameters['resourceId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: resourceId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of LwM2M objects parsed from Resources with type 'LWM2M_MODEL' owned by tenant or sysadmin. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. LwM2M Object is a object that includes information about the LwM2M model which can be used in transport configuration for the LwM2M device profile. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getLwm2mListObjectsPageUsingGET
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the resource title.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getLwm2mListObjectsPageUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/resource/lwm2m/page{?page,pageSize,sortOrder,sortProperty,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of LwM2M objects parsed from Resources with type 'LWM2M_MODEL' owned by tenant or sysadmin. You can specify parameters to filter the results. LwM2M Object is a object that includes information about the LwM2M model which can be used in transport configuration for the LwM2M device profile. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getLwm2mListObjectsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.objectIds - LwM2M Object ids.
 */
 ThingsboardRestApi.prototype.getLwm2mListObjectsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/resource/lwm2m{?objectIds,sortOrder,sortProperty}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


        if(parameters['sortOrder'] === undefined){
            deferred.reject(new Error('Missing required  parameter: sortOrder'));
            return deferred.promise;
        }
 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


        if(parameters['sortProperty'] === undefined){
            deferred.reject(new Error('Missing required  parameter: sortProperty'));
            return deferred.promise;
        }
 

                if(parameters['objectIds'] !== undefined){
                    queryParameters['objectIds'] = parameters['objectIds'];
                }
        
        
        


        if(parameters['objectIds'] === undefined){
            deferred.reject(new Error('Missing required  parameter: objectIds'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the Resource object based on the provided Resource Id. Resource is a heavyweight object that includes main information about the Resource and also data. 

Available for users with 'SYS_ADMIN' or 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getResourceByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.resourceId - A string value representing the resource id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getResourceByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/resource/{resourceId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{resourceId}', parameters['resourceId']);
        
        


        if(parameters['resourceId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: resourceId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Deletes the Resource. Referencing non-existing Resource Id will cause an error.

Available for users with 'SYS_ADMIN' or 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#deleteResourceUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.resourceId - A string value representing the resource id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.deleteResourceUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/resource/{resourceId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{resourceId}', parameters['resourceId']);
        
        


        if(parameters['resourceId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: resourceId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Download Resource based on the provided Resource Id.

Available for users with 'SYS_ADMIN' or 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#downloadResourceUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.resourceId - A string value representing the resource id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.downloadResourceUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/resource/{resourceId}/download';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{resourceId}', parameters['resourceId']);
        
        


        if(parameters['resourceId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: resourceId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of Resource Info objects owned by tenant or sysadmin. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. Resource Info is a lightweight object that includes main information about the Resource excluding the heavyweight data. 

Available for users with 'SYS_ADMIN' or 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getResourcesUsingGET
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the resource title.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getResourcesUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/resource{?page,pageSize,sortOrder,sortProperty,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Creates or updates the device attributes based on device id and specified attribute scope. The request payload is a JSON object with key-value format of attributes to create or update. For example:

```json
{
 "stringKey":"value1", 
 "booleanKey":true, 
 "doubleKey":42.0, 
 "longKey":73, 
 "jsonKey": {
    "someNumber": 42,
    "someArray": [1,2,3],
    "someNestedObject": {"key": "value"}
 }
}
```


Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#saveDeviceAttributesUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.deviceId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.scope - A string value representing the attributes scope. For example, 'SERVER_SCOPE'.
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveDeviceAttributesUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/plugins/telemetry/{deviceId}/{scope}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
            path = path.replace('{deviceId}', parameters['deviceId']);
        
        


        if(parameters['deviceId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{scope}', parameters['scope']);
        
        


        if(parameters['scope'] === undefined){
            deferred.reject(new Error('Missing required  parameter: scope'));
            return deferred.promise;
        }
 
        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Delete device attributes using provided Device Id, scope and a list of keys. Referencing a non-existing Device Id will cause an error

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#deleteDeviceAttributesUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.deviceId - A string value representing the device id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.scope - A string value representing the attributes scope. For example, 'SERVER_SCOPE'.
     * @param {string} parameters.keys - A string value representing the comma-separated list of attributes keys. For example, 'active,inactivityAlarmTime'.
 */
 ThingsboardRestApi.prototype.deleteDeviceAttributesUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/plugins/telemetry/{deviceId}/{scope}{?keys}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{deviceId}', parameters['deviceId']);
        
        


        if(parameters['deviceId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: deviceId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{scope}', parameters['scope']);
        
        


        if(parameters['scope'] === undefined){
            deferred.reject(new Error('Missing required  parameter: scope'));
            return deferred.promise;
        }
 

                if(parameters['keys'] !== undefined){
                    queryParameters['keys'] = parameters['keys'];
                }
        
        
        


        if(parameters['keys'] === undefined){
            deferred.reject(new Error('Missing required  parameter: keys'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Creates or updates the entity attributes based on Entity Id and the specified attribute scope.  List of possible attribute scopes depends on the entity type: 

 * SERVER_SCOPE - supported for all entity types;
 * CLIENT_SCOPE - supported for devices;
 * SHARED_SCOPE - supported for devices. 

The request payload is a JSON object with key-value format of attributes to create or update. For example:

```json
{
 "stringKey":"value1", 
 "booleanKey":true, 
 "doubleKey":42.0, 
 "longKey":73, 
 "jsonKey": {
    "someNumber": 42,
    "someArray": [1,2,3],
    "someNestedObject": {"key": "value"}
 }
}
```
Referencing a non-existing entity Id or invalid entity type will cause an error. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#saveEntityAttributesV2UsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.entityId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.scope - A string value representing the attributes scope. For example, 'SERVER_SCOPE'.
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveEntityAttributesV2UsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/plugins/telemetry/{entityType}/{entityId}/attributes/{scope}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
            path = path.replace('{entityType}', parameters['entityType']);
        
        


        if(parameters['entityType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityType'));
            return deferred.promise;
        }
 
        
            path = path.replace('{entityId}', parameters['entityId']);
        
        


        if(parameters['entityId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{scope}', parameters['scope']);
        
        


        if(parameters['scope'] === undefined){
            deferred.reject(new Error('Missing required  parameter: scope'));
            return deferred.promise;
        }
 
        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a set of unique attribute key names for the selected entity. The response will include merged key names set for all attribute scopes:

 * SERVER_SCOPE - supported for all entity types;
 * CLIENT_SCOPE - supported for devices;
 * SHARED_SCOPE - supported for devices. 

Referencing a non-existing entity Id or invalid entity type will cause an error. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getAttributeKeysUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.entityId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getAttributeKeysUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/plugins/telemetry/{entityType}/{entityId}/keys/attributes';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{entityType}', parameters['entityType']);
        
        


        if(parameters['entityType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityType'));
            return deferred.promise;
        }
 
        
            path = path.replace('{entityId}', parameters['entityId']);
        
        


        if(parameters['entityId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a set of unique attribute key names for the selected entity and attributes scope: 

 * SERVER_SCOPE - supported for all entity types;
 * CLIENT_SCOPE - supported for devices;
 * SHARED_SCOPE - supported for devices. 

Referencing a non-existing entity Id or invalid entity type will cause an error. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getAttributeKeysByScopeUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.entityId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.scope - A string value representing the attributes scope. For example, 'SERVER_SCOPE'.
 */
 ThingsboardRestApi.prototype.getAttributeKeysByScopeUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/plugins/telemetry/{entityType}/{entityId}/keys/attributes/{scope}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{entityType}', parameters['entityType']);
        
        


        if(parameters['entityType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityType'));
            return deferred.promise;
        }
 
        
            path = path.replace('{entityId}', parameters['entityId']);
        
        


        if(parameters['entityId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{scope}', parameters['scope']);
        
        


        if(parameters['scope'] === undefined){
            deferred.reject(new Error('Missing required  parameter: scope'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a set of unique time-series key names for the selected entity. 

Referencing a non-existing entity Id or invalid entity type will cause an error. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getTimeseriesKeysUsingGET_1
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.entityId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getTimeseriesKeysUsingGET_1 = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/plugins/telemetry/{entityType}/{entityId}/keys/timeseries';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{entityType}', parameters['entityType']);
        
        


        if(parameters['entityType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityType'));
            return deferred.promise;
        }
 
        
            path = path.replace('{entityId}', parameters['entityId']);
        
        


        if(parameters['entityId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Delete time-series for selected entity based on entity id, entity type and keys. Use 'deleteAllDataForKeys' to delete all time-series data. Use 'startTs' and 'endTs' to specify time-range instead.  Use 'rewriteLatestIfDeleted' to rewrite latest value (stored in separate table for performance) after deletion of the time range. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#deleteEntityTimeseriesUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.entityId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.keys - A string value representing the comma-separated list of telemetry keys. If keys are not selected, the result will return all latest timeseries. For example, 'temperature,humidity'.
     * @param {boolean} parameters.deleteAllDataForKeys - A boolean value to specify if should be deleted all data for selected keys or only data that are in the selected time range.
     * @param {integer} parameters.startTs - A long value representing the start timestamp of removal time range in milliseconds.
     * @param {integer} parameters.endTs - A long value representing the end timestamp of removal time range in milliseconds.
     * @param {boolean} parameters.rewriteLatestIfDeleted - If the parameter is set to true, the latest telemetry will be rewritten in case that current latest value was removed, otherwise, in case that parameter is set to false the new latest value will not set.
 */
 ThingsboardRestApi.prototype.deleteEntityTimeseriesUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/plugins/telemetry/{entityType}/{entityId}/timeseries/delete{?deleteAllDataForKeys,endTs,keys,rewriteLatestIfDeleted,startTs}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{entityType}', parameters['entityType']);
        
        


        if(parameters['entityType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityType'));
            return deferred.promise;
        }
 
        
            path = path.replace('{entityId}', parameters['entityId']);
        
        


        if(parameters['entityId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityId'));
            return deferred.promise;
        }
 

                if(parameters['keys'] !== undefined){
                    queryParameters['keys'] = parameters['keys'];
                }
        
        
        


        if(parameters['keys'] === undefined){
            deferred.reject(new Error('Missing required  parameter: keys'));
            return deferred.promise;
        }
 

                if(parameters['deleteAllDataForKeys'] !== undefined){
                    queryParameters['deleteAllDataForKeys'] = parameters['deleteAllDataForKeys'];
                }
        
        
        


 

                if(parameters['startTs'] !== undefined){
                    queryParameters['startTs'] = parameters['startTs'];
                }
        
        
        


 

                if(parameters['endTs'] !== undefined){
                    queryParameters['endTs'] = parameters['endTs'];
                }
        
        
        


 

                if(parameters['rewriteLatestIfDeleted'] !== undefined){
                    queryParameters['rewriteLatestIfDeleted'] = parameters['rewriteLatestIfDeleted'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Creates or updates the entity time-series data based on the Entity Id and request payload.The request payload is a JSON document with three possible formats:

Simple format without timestamp. In such a case, current server time will be used: 

```json
{"temperature": 26}
```

 Single JSON object with timestamp: 

```json
{"ts":1634712287000,"values":{"temperature":26, "humidity":87}}
```

 JSON array with timestamps: 

```json
[{"ts":1634712287000,"values":{"temperature":26, "humidity":87}}, {"ts":1634712588000,"values":{"temperature":25, "humidity":88}}]
```

 The scope parameter is not used in the API call implementation but should be specified whatever value because it is used as a path variable. 

The ttl parameter takes affect only in case of Cassandra DB.Referencing a non-existing entity Id or invalid entity type will cause an error. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#saveEntityTelemetryWithTTLUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.entityId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
    
     * @param {integer} parameters.ttl - A long value representing TTL (Time to Live) parameter.
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveEntityTelemetryWithTTLUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/plugins/telemetry/{entityType}/{entityId}/timeseries/{scope}/{ttl}?scope=ANY';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
            path = path.replace('{entityType}', parameters['entityType']);
        
        


        if(parameters['entityType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityType'));
            return deferred.promise;
        }
 
        
            path = path.replace('{entityId}', parameters['entityId']);
        
        


        if(parameters['entityId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{scope}', parameters['scope']);
        
        


        if(parameters['scope'] === undefined){
            deferred.reject(new Error('Missing required  parameter: scope'));
            return deferred.promise;
        }
 
        
            path = path.replace('{ttl}', parameters['ttl']);
        
        


        if(parameters['ttl'] === undefined){
            deferred.reject(new Error('Missing required  parameter: ttl'));
            return deferred.promise;
        }
 
        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Creates or updates the entity time-series data based on the Entity Id and request payload.The request payload is a JSON document with three possible formats:

Simple format without timestamp. In such a case, current server time will be used: 

```json
{"temperature": 26}
```

 Single JSON object with timestamp: 

```json
{"ts":1634712287000,"values":{"temperature":26, "humidity":87}}
```

 JSON array with timestamps: 

```json
[{"ts":1634712287000,"values":{"temperature":26, "humidity":87}}, {"ts":1634712588000,"values":{"temperature":25, "humidity":88}}]
```

 The scope parameter is not used in the API call implementation but should be specified whatever value because it is used as a path variable. Referencing a non-existing entity Id or invalid entity type will cause an error. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#saveEntityTelemetryUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.entityId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
    
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveEntityTelemetryUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/plugins/telemetry/{entityType}/{entityId}/timeseries/{scope}?scope=ANY';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
            path = path.replace('{entityType}', parameters['entityType']);
        
        


        if(parameters['entityType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityType'));
            return deferred.promise;
        }
 
        
            path = path.replace('{entityId}', parameters['entityId']);
        
        


        if(parameters['entityId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{scope}', parameters['scope']);
        
        


        if(parameters['scope'] === undefined){
            deferred.reject(new Error('Missing required  parameter: scope'));
            return deferred.promise;
        }
 
        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns all attributes of a specified scope that belong to specified entity. List of possible attribute scopes depends on the entity type: 

 * SERVER_SCOPE - supported for all entity types;
 * CLIENT_SCOPE - supported for devices;
 * SHARED_SCOPE - supported for devices. 

Use optional 'keys' parameter to return specific attributes.
 Example of the result: 

```json
[
  {"key": "stringAttributeKey", "value": "value", "lastUpdateTs": 1609459200000},
  {"key": "booleanAttributeKey", "value": false, "lastUpdateTs": 1609459200001},
  {"key": "doubleAttributeKey", "value": 42.2, "lastUpdateTs": 1609459200002},
  {"key": "longKeyExample", "value": 73, "lastUpdateTs": 1609459200003},
  {"key": "jsonKeyExample",
    "value": {
      "someNumber": 42,
      "someArray": [1,2,3],
      "someNestedObject": {"key": "value"}
    },
    "lastUpdateTs": 1609459200004
  }
]
```

 Referencing a non-existing entity Id or invalid entity type will cause an error. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getAttributesByScopeUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.entityId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.scope - A string value representing the attributes scope. For example, 'SERVER_SCOPE'.
     * @param {string} parameters.keys - A string value representing the comma-separated list of attributes keys. For example, 'active,inactivityAlarmTime'.
 */
 ThingsboardRestApi.prototype.getAttributesByScopeUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/plugins/telemetry/{entityType}/{entityId}/values/attributes/{scope}{?keys}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{entityType}', parameters['entityType']);
        
        


        if(parameters['entityType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityType'));
            return deferred.promise;
        }
 
        
            path = path.replace('{entityId}', parameters['entityId']);
        
        


        if(parameters['entityId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{scope}', parameters['scope']);
        
        


        if(parameters['scope'] === undefined){
            deferred.reject(new Error('Missing required  parameter: scope'));
            return deferred.promise;
        }
 

                if(parameters['keys'] !== undefined){
                    queryParameters['keys'] = parameters['keys'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns all attributes that belong to specified entity. Use optional 'keys' parameter to return specific attributes.
 Example of the result: 

```json
[
  {"key": "stringAttributeKey", "value": "value", "lastUpdateTs": 1609459200000},
  {"key": "booleanAttributeKey", "value": false, "lastUpdateTs": 1609459200001},
  {"key": "doubleAttributeKey", "value": 42.2, "lastUpdateTs": 1609459200002},
  {"key": "longKeyExample", "value": 73, "lastUpdateTs": 1609459200003},
  {"key": "jsonKeyExample",
    "value": {
      "someNumber": 42,
      "someArray": [1,2,3],
      "someNestedObject": {"key": "value"}
    },
    "lastUpdateTs": 1609459200004
  }
]
```

 Referencing a non-existing entity Id or invalid entity type will cause an error. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getAttributesUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.entityId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.keys - A string value representing the comma-separated list of attributes keys. For example, 'active,inactivityAlarmTime'.
 */
 ThingsboardRestApi.prototype.getAttributesUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/plugins/telemetry/{entityType}/{entityId}/values/attributes{?keys}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{entityType}', parameters['entityType']);
        
        


        if(parameters['entityType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityType'));
            return deferred.promise;
        }
 
        
            path = path.replace('{entityId}', parameters['entityId']);
        
        


        if(parameters['entityId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityId'));
            return deferred.promise;
        }
 

                if(parameters['keys'] !== undefined){
                    queryParameters['keys'] = parameters['keys'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a range of time-series values for specified entity. Returns not aggregated data by default. Use aggregation function ('agg') and aggregation interval ('interval') to enable aggregation of the results on the database / server side. The aggregation is generally more efficient then fetching all records. 

```json
{
  "temperature": [
    {
      "value": 36.7,
      "ts": 1609459200000
    },
    {
      "value": 36.6,
      "ts": 1609459201000
    }
  ]
}
```

Referencing a non-existing entity Id or invalid entity type will cause an error. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getTimeseriesUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.entityId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.keys - A string value representing the comma-separated list of telemetry keys.
     * @param {integer} parameters.startTs - A long value representing the start timestamp of the time range in milliseconds, UTC.
     * @param {integer} parameters.endTs - A long value representing the end timestamp of the time range in milliseconds, UTC.
     * @param {integer} parameters.interval - A long value representing the aggregation interval range in milliseconds.
     * @param {integer} parameters.limit - An integer value that represents a max number of timeseries data points to fetch. This parameter is used only in the case if 'agg' parameter is set to 'NONE'.
     * @param {string} parameters.agg - A string value representing the aggregation function. If the interval is not specified, 'agg' parameter will use 'NONE' value.
     * @param {string} parameters.orderBy - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
     * @param {boolean} parameters.useStrictDataTypes - Enables/disables conversion of telemetry values to strings. Conversion is enabled by default. Set parameter to 'true' in order to disable the conversion.
 */
 ThingsboardRestApi.prototype.getTimeseriesUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/plugins/telemetry/{entityType}/{entityId}/values/timeseries{?agg,endTs,interval,keys,limit,orderBy,startTs,useStrictDataTypes}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{entityType}', parameters['entityType']);
        
        


        if(parameters['entityType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityType'));
            return deferred.promise;
        }
 
        
            path = path.replace('{entityId}', parameters['entityId']);
        
        


        if(parameters['entityId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityId'));
            return deferred.promise;
        }
 

                if(parameters['keys'] !== undefined){
                    queryParameters['keys'] = parameters['keys'];
                }
        
        
        


        if(parameters['keys'] === undefined){
            deferred.reject(new Error('Missing required  parameter: keys'));
            return deferred.promise;
        }
 

                if(parameters['startTs'] !== undefined){
                    queryParameters['startTs'] = parameters['startTs'];
                }
        
        
        


        if(parameters['startTs'] === undefined){
            deferred.reject(new Error('Missing required  parameter: startTs'));
            return deferred.promise;
        }
 

                if(parameters['endTs'] !== undefined){
                    queryParameters['endTs'] = parameters['endTs'];
                }
        
        
        


        if(parameters['endTs'] === undefined){
            deferred.reject(new Error('Missing required  parameter: endTs'));
            return deferred.promise;
        }
 

                if(parameters['interval'] !== undefined){
                    queryParameters['interval'] = parameters['interval'];
                }
        
        
        


 

                if(parameters['limit'] !== undefined){
                    queryParameters['limit'] = parameters['limit'];
                }
        
        
        


 

                if(parameters['agg'] !== undefined){
                    queryParameters['agg'] = parameters['agg'];
                }
        
        
        


 

                if(parameters['orderBy'] !== undefined){
                    queryParameters['orderBy'] = parameters['orderBy'];
                }
        
        
        


 

                if(parameters['useStrictDataTypes'] !== undefined){
                    queryParameters['useStrictDataTypes'] = parameters['useStrictDataTypes'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns all time-series that belong to specified entity. Use optional 'keys' parameter to return specific time-series. The result is a JSON object. The format of the values depends on the 'useStrictDataTypes' parameter. By default, all time-series values are converted to strings: 

```json
{
  "stringTsKey": [{ "value": "value", "ts": 1609459200000}],
  "booleanTsKey": [{ "value": "false", "ts": 1609459200000}],
  "doubleTsKey": [{ "value": "42.2", "ts": 1609459200000}],
  "longTsKey": [{ "value": "73", "ts": 1609459200000}],
  "jsonTsKey": [{ "value": "{\"someNumber\": 42,\"someArray\": [1,2,3],\"someNestedObject\": {\"key\": \"value\"}}", "ts": 1609459200000}]
}

```

 However, it is possible to request the values without conversion ('useStrictDataTypes'=true): 

```json
{
  "stringTsKey": [{ "value": "value", "ts": 1609459200000}],
  "booleanTsKey": [{ "value": false, "ts": 1609459200000}],
  "doubleTsKey": [{ "value": 42.2, "ts": 1609459200000}],
  "longTsKey": [{ "value": 73, "ts": 1609459200000}],
  "jsonTsKey": [{ 
    "value": {
      "someNumber": 42,
      "someArray": [1,2,3],
      "someNestedObject": {"key": "value"}
    }, 
    "ts": 1609459200000}]
}

```

 Referencing a non-existing entity Id or invalid entity type will cause an error. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getLatestTimeseriesUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.entityId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.keys - A string value representing the comma-separated list of telemetry keys. If keys are not selected, the result will return all latest timeseries. For example, 'temperature,humidity'.
     * @param {boolean} parameters.useStrictDataTypes - Enables/disables conversion of telemetry values to strings. Conversion is enabled by default. Set parameter to 'true' in order to disable the conversion.
 */
 ThingsboardRestApi.prototype.getLatestTimeseriesUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/plugins/telemetry/{entityType}/{entityId}/values/timeseries{?keys,useStrictDataTypes}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{entityType}', parameters['entityType']);
        
        


        if(parameters['entityType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityType'));
            return deferred.promise;
        }
 
        
            path = path.replace('{entityId}', parameters['entityId']);
        
        


        if(parameters['entityId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityId'));
            return deferred.promise;
        }
 

                if(parameters['keys'] !== undefined){
                    queryParameters['keys'] = parameters['keys'];
                }
        
        
        


 

                if(parameters['useStrictDataTypes'] !== undefined){
                    queryParameters['useStrictDataTypes'] = parameters['useStrictDataTypes'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Creates or updates the entity attributes based on Entity Id and the specified attribute scope.  List of possible attribute scopes depends on the entity type: 

 * SERVER_SCOPE - supported for all entity types;
 * CLIENT_SCOPE - supported for devices;
 * SHARED_SCOPE - supported for devices. 

The request payload is a JSON object with key-value format of attributes to create or update. For example:

```json
{
 "stringKey":"value1", 
 "booleanKey":true, 
 "doubleKey":42.0, 
 "longKey":73, 
 "jsonKey": {
    "someNumber": 42,
    "someArray": [1,2,3],
    "someNestedObject": {"key": "value"}
 }
}
```
Referencing a non-existing entity Id or invalid entity type will cause an error. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#saveEntityAttributesV1UsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.entityId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.scope - A string value representing the attributes scope. For example, 'SERVER_SCOPE'.
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveEntityAttributesV1UsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/plugins/telemetry/{entityType}/{entityId}/{scope}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
            path = path.replace('{entityType}', parameters['entityType']);
        
        


        if(parameters['entityType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityType'));
            return deferred.promise;
        }
 
        
            path = path.replace('{entityId}', parameters['entityId']);
        
        


        if(parameters['entityId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{scope}', parameters['scope']);
        
        


        if(parameters['scope'] === undefined){
            deferred.reject(new Error('Missing required  parameter: scope'));
            return deferred.promise;
        }
 
        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Delete entity attributes using provided Entity Id, scope and a list of keys. Referencing a non-existing entity Id or invalid entity type will cause an error. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#deleteEntityAttributesUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.entityType - A string value representing the entity type. For example, 'DEVICE'
     * @param {string} parameters.entityId - A string value representing the entity id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {string} parameters.scope - A string value representing the attributes scope. For example, 'SERVER_SCOPE'.
     * @param {string} parameters.keys - A string value representing the comma-separated list of attributes keys. For example, 'active,inactivityAlarmTime'.
 */
 ThingsboardRestApi.prototype.deleteEntityAttributesUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/plugins/telemetry/{entityType}/{entityId}/{scope}{?keys}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{entityType}', parameters['entityType']);
        
        


        if(parameters['entityType'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityType'));
            return deferred.promise;
        }
 
        
            path = path.replace('{entityId}', parameters['entityId']);
        
        


        if(parameters['entityId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: entityId'));
            return deferred.promise;
        }
 
        
            path = path.replace('{scope}', parameters['scope']);
        
        


        if(parameters['scope'] === undefined){
            deferred.reject(new Error('Missing required  parameter: scope'));
            return deferred.promise;
        }
 

                if(parameters['keys'] !== undefined){
                    queryParameters['keys'] = parameters['keys'];
                }
        
        
        


        if(parameters['keys'] === undefined){
            deferred.reject(new Error('Missing required  parameter: keys'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Create or update the Tenant. When creating tenant, platform generates Tenant Id as [time-based UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_1_(date-time_and_MAC_address)). Default Rule Chain and Device profile are also generated for the new tenants automatically. The newly created Tenant Id will be present in the response. Specify existing Tenant Id id to update the Tenant. Referencing non-existing Tenant Id will cause 'Not Found' error.

Available for users with 'SYS_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#saveTenantUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveTenantUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenant';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the Tenant Info object based on the provided Tenant Id. The Tenant Info object extends regular Tenant object and includes Tenant Profile name. 

Available for users with 'SYS_ADMIN' or 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantInfoByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.tenantId - A string value representing the tenant id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getTenantInfoByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenant/info/{tenantId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{tenantId}', parameters['tenantId']);
        
        


        if(parameters['tenantId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the Tenant object based on the provided Tenant Id. 

Available for users with 'SYS_ADMIN' or 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.tenantId - A string value representing the tenant id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getTenantByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenant/{tenantId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{tenantId}', parameters['tenantId']);
        
        


        if(parameters['tenantId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Deletes the tenant, it's customers, rule chains, devices and all other related entities. Referencing non-existing tenant Id will cause an error.

Available for users with 'SYS_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#deleteTenantUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.tenantId - A string value representing the tenant id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.deleteTenantUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenant/{tenantId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{tenantId}', parameters['tenantId']);
        
        


        if(parameters['tenantId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of tenant info objects registered in the platform. The Tenant Info object extends regular Tenant object and includes Tenant Profile name. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'SYS_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantInfosUsingGET
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the tenant name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getTenantInfosUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenantInfos{?page,pageSize,sortOrder,sortProperty,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of tenants registered in the platform. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'SYS_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the tenant name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getTenantsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenants{?page,pageSize,sortOrder,sortProperty,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Create or update the Tenant Profile. When creating tenant profile, platform generates Tenant Profile Id as [time-based UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_1_(date-time_and_MAC_address)). The newly created Tenant Profile Id will be present in the response. Specify existing Tenant Profile Id id to update the Tenant Profile. Referencing non-existing Tenant Profile Id will cause 'Not Found' error. 

Update of the tenant profile configuration will cause immediate recalculation of API limits for all affected Tenants. 

The **'profileData'** object is the part of Tenant Profile that defines API limits and Rate limits. 

You have an ability to define maximum number of devices ('maxDevice'), assets ('maxAssets') and other entities. You may also define maximum number of messages to be processed per month ('maxTransportMessages', 'maxREExecutions', etc). The '*RateLimit' defines the rate limits using simple syntax. For example, '1000:1,20000:60' means up to 1000 events per second but no more than 20000 event per minute. Let's review the example of tenant profile data below: 

```json
{
  "name": "Default",
  "description": "Default tenant profile",
  "isolatedTbCore": false,
  "isolatedTbRuleEngine": false,
  "profileData": {
    "configuration": {
      "type": "DEFAULT",
      "maxDevices": 0,
      "maxAssets": 0,
      "maxCustomers": 0,
      "maxUsers": 0,
      "maxDashboards": 0,
      "maxRuleChains": 0,
      "maxResourcesInBytes": 0,
      "maxOtaPackagesInBytes": 0,
      "transportTenantMsgRateLimit": "1000:1,20000:60",
      "transportTenantTelemetryMsgRateLimit": "1000:1,20000:60",
      "transportTenantTelemetryDataPointsRateLimit": "1000:1,20000:60",
      "transportDeviceMsgRateLimit": "20:1,600:60",
      "transportDeviceTelemetryMsgRateLimit": "20:1,600:60",
      "transportDeviceTelemetryDataPointsRateLimit": "20:1,600:60",
      "maxTransportMessages": 10000000,
      "maxTransportDataPoints": 10000000,
      "maxREExecutions": 4000000,
      "maxJSExecutions": 5000000,
      "maxDPStorageDays": 0,
      "maxRuleNodeExecutionsPerMessage": 50,
      "maxEmails": 0,
      "maxSms": 0,
      "maxCreatedAlarms": 1000,
      "defaultStorageTtlDays": 0,
      "alarmsTtlDays": 0,
      "rpcTtlDays": 0,
      "warnThreshold": 0
    }
  },
  "default": true
}
```

Available for users with 'SYS_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#saveTenantProfileUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveTenantProfileUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenantProfile';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the Tenant Profile object based on the provided Tenant Profile Id. 

Available for users with 'SYS_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantProfileByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.tenantProfileId - A string value representing the tenant profile id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getTenantProfileByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenantProfile/{tenantProfileId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{tenantProfileId}', parameters['tenantProfileId']);
        
        


        if(parameters['tenantProfileId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: tenantProfileId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Deletes the tenant profile. Referencing non-existing tenant profile Id will cause an error. Referencing profile that is used by the tenants will cause an error. 

Available for users with 'SYS_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#deleteTenantProfileUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.tenantProfileId - A string value representing the tenant profile id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.deleteTenantProfileUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenantProfile/{tenantProfileId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{tenantProfileId}', parameters['tenantProfileId']);
        
        


        if(parameters['tenantProfileId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: tenantProfileId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Makes specified tenant profile to be default. Referencing non-existing tenant profile Id will cause an error. 

Available for users with 'SYS_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#setDefaultTenantProfileUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.tenantProfileId - A string value representing the tenant profile id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.setDefaultTenantProfileUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenantProfile/{tenantProfileId}/default';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{tenantProfileId}', parameters['tenantProfileId']);
        
        


        if(parameters['tenantProfileId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: tenantProfileId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the default Tenant Profile Info object based. Tenant Profile Info is a lightweight object that contains only id and name of the profile. 

Available for users with 'SYS_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getDefaultTenantProfileInfoUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.getDefaultTenantProfileInfoUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenantProfileInfo/default';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the Tenant Profile Info object based on the provided Tenant Profile Id. Tenant Profile Info is a lightweight object that contains only id and name of the profile. 

Available for users with 'SYS_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantProfileInfoByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.tenantProfileId - A string value representing the tenant profile id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getTenantProfileInfoByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenantProfileInfo/{tenantProfileId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{tenantProfileId}', parameters['tenantProfileId']);
        
        


        if(parameters['tenantProfileId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: tenantProfileId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of tenant profile info objects registered in the platform. Tenant Profile Info is a lightweight object that contains only id and name of the profile. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'SYS_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantProfileInfosUsingGET
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the tenant profile name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getTenantProfileInfosUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenantProfileInfos{?page,pageSize,sortOrder,sortProperty,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of tenant profiles registered in the platform. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'SYS_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantProfilesUsingGET
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the tenant profile name.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getTenantProfilesUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenantProfiles{?page,pageSize,sortOrder,sortProperty,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Get UI help base url used to fetch help assets. The actual value of the base url is configurable in the system configuration file.
 * @method
 * @name ThingsboardRestApi#getHelpBaseUrlUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.getHelpBaseUrlUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/uiSettings/helpBaseUrl';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of users owned by customer. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getCustomerUsersUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.customerId - A string value representing the customer id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the user email.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getCustomerUsersUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/customer/{customerId}/users{?page,pageSize,sortOrder,sortProperty,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{customerId}', parameters['customerId']);
        
        


        if(parameters['customerId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: customerId'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of users owned by tenant. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'SYS_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getTenantAdminsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.tenantId - A string value representing the tenant id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the user email.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getTenantAdminsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/tenant/{tenantId}/users{?page,pageSize,sortOrder,sortProperty,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{tenantId}', parameters['tenantId']);
        
        


        if(parameters['tenantId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }
 

                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Force send the activation email to the user. Useful to resend the email if user has accidentally deleted it. 

Available for users with 'SYS_ADMIN' or 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#sendActivationEmailUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.email - Email of the user
 */
 ThingsboardRestApi.prototype.sendActivationEmailUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/user/sendActivationMail{?email}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['email'] !== undefined){
                    queryParameters['email'] = parameters['email'];
                }
        
        
        


        if(parameters['email'] === undefined){
            deferred.reject(new Error('Missing required  parameter: email'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Checks that the system is configured to allow administrators to impersonate themself as other users. If the user who performs the request has the authority of 'SYS_ADMIN', it is possible to login as any tenant administrator. If the user who performs the request has the authority of 'TENANT_ADMIN', it is possible to login as any customer user. 
 * @method
 * @name ThingsboardRestApi#isUserTokenAccessEnabledUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.isUserTokenAccessEnabledUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/user/tokenAccessEnabled';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Fetch the User object based on the provided User Id. If the user has the authority of 'SYS_ADMIN', the server does not perform additional checks. If the user has the authority of 'TENANT_ADMIN', the server checks that the requested user is owned by the same tenant. If the user has the authority of 'CUSTOMER_USER', the server checks that the requested user is owned by the same customer.
 * @method
 * @name ThingsboardRestApi#getUserByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.userId - A string value representing the user id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getUserByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/user/{userId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{userId}', parameters['userId']);
        
        


        if(parameters['userId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Deletes the User, it's credentials and all the relations (from and to the User). Referencing non-existing User Id will cause an error. 

Available for users with 'SYS_ADMIN' or 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#deleteUserUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.userId - A string value representing the user id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.deleteUserUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/user/{userId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{userId}', parameters['userId']);
        
        


        if(parameters['userId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Get the activation link for the user. The base url for activation link is configurable in the general settings of system administrator. 

Available for users with 'SYS_ADMIN' or 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getActivationLinkUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.userId - A string value representing the user id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getActivationLinkUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/user/{userId}/activationLink';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{userId}', parameters['userId']);
        
        


        if(parameters['userId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns the token of the User based on the provided User Id. If the user who performs the request has the authority of 'SYS_ADMIN', it is possible to get the token of any tenant administrator. If the user who performs the request has the authority of 'TENANT_ADMIN', it is possible to get the token of any customer user that belongs to the same tenant. 
 * @method
 * @name ThingsboardRestApi#getUserTokenUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.userId - A string value representing the user id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getUserTokenUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/user/{userId}/token';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{userId}', parameters['userId']);
        
        


        if(parameters['userId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Enables or Disables user credentials. Useful when you would like to block user account without deleting it. You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#setUserCredentialsEnabledUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.userId - A string value representing the user id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
     * @param {boolean} parameters.userCredentialsEnabled - Disable ("true") or enable ("false") the credentials.
 */
 ThingsboardRestApi.prototype.setUserCredentialsEnabledUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/user/{userId}/userCredentialsEnabled{?userCredentialsEnabled}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{userId}', parameters['userId']);
        
        


        if(parameters['userId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }
 

                if(parameters['userCredentialsEnabled'] !== undefined){
                    queryParameters['userCredentialsEnabled'] = parameters['userCredentialsEnabled'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of users owned by tenant or customer. The scope depends on authority of the user that performs the request.You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for users with 'TENANT_ADMIN' or 'CUSTOMER_USER' authority.
 * @method
 * @name ThingsboardRestApi#getUsersUsingGET
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the user email.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getUsersUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/users{?page,pageSize,sortOrder,sortProperty,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Create or update the User. When creating user, platform generates User Id as [time-based UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_1_(date-time_and_MAC_address)). The newly created User Id will be present in the response. Specify existing User Id to update the device. Referencing non-existing User Id will cause 'Not Found' error.

Device email is unique for entire platform setup.
 * @method
 * @name ThingsboardRestApi#saveUserUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {boolean} parameters.sendActivationMail - Send activation email (or use activation link)
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveUserUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/user{?sendActivationMail}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];


                if(parameters['sendActivationMail'] !== undefined){
                    queryParameters['sendActivationMail'] = parameters['sendActivationMail'];
                }
        
        
        


 
        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Create or update the Widget Type. Widget Type represents the template for widget creation. Widget Type and Widget are similar to class and object in OOP theory. When creating the Widget Type, platform generates Widget Type Id as [time-based UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_1_(date-time_and_MAC_address)). The newly created Widget Type Id will be present in the response. Specify existing Widget Type id to update the Widget Type. Referencing non-existing Widget Type Id will cause 'Not Found' error.

Widget Type alias is unique in the scope of Widget Bundle. Special Tenant Id '13814000-1dd2-11b2-8080-808080808080' is automatically used if the create request is sent by user with 'SYS_ADMIN' authority.

Available for users with 'SYS_ADMIN' or 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#saveWidgetTypeUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveWidgetTypeUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/widgetType';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Get the Widget Type Details based on the provided Widget Type Id. Widget Type Details extend Widget Type and add image and description properties. Those properties are useful to edit the Widget Type but they are not required for Dashboard rendering. 

Available for users with 'SYS_ADMIN' or 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getWidgetTypeByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.widgetTypeId - A string value representing the widget type id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getWidgetTypeByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/widgetType/{widgetTypeId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{widgetTypeId}', parameters['widgetTypeId']);
        
        


        if(parameters['widgetTypeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: widgetTypeId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Deletes the  Widget Type. Referencing non-existing Widget Type Id will cause an error.

Available for users with 'SYS_ADMIN' or 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#deleteWidgetTypeUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.widgetTypeId - A string value representing the widget type id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.deleteWidgetTypeUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/widgetType/{widgetTypeId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{widgetTypeId}', parameters['widgetTypeId']);
        
        


        if(parameters['widgetTypeId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: widgetTypeId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns an array of Widget Type Details objects that belong to specified Widget Bundle.Widget Type Details extend Widget Type and add image and description properties. Those properties are useful to edit the Widget Type but they are not required for Dashboard rendering.  

Available for users with 'SYS_ADMIN' or 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getBundleWidgetTypesDetailsUsingGET
 * @param {object} parameters - method options and parameters
     * @param {boolean} parameters.isSystem - System or Tenant
     * @param {string} parameters.bundleAlias - Widget Bundle alias
 */
 ThingsboardRestApi.prototype.getBundleWidgetTypesDetailsUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/widgetTypesDetails{?bundleAlias,isSystem}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['isSystem'] !== undefined){
                    queryParameters['isSystem'] = parameters['isSystem'];
                }
        
        
        


        if(parameters['isSystem'] === undefined){
            deferred.reject(new Error('Missing required  parameter: isSystem'));
            return deferred.promise;
        }
 

                if(parameters['bundleAlias'] !== undefined){
                    queryParameters['bundleAlias'] = parameters['bundleAlias'];
                }
        
        
        


        if(parameters['bundleAlias'] === undefined){
            deferred.reject(new Error('Missing required  parameter: bundleAlias'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Get the Widget Type Info objects based on the provided parameters. Widget Type Info is a lightweight object that represents Widget Type but does not contain the heavyweight widget descriptor JSON

Available for any authorized user. 
 * @method
 * @name ThingsboardRestApi#getBundleWidgetTypesInfosUsingGET
 * @param {object} parameters - method options and parameters
     * @param {boolean} parameters.isSystem - System or Tenant
     * @param {string} parameters.bundleAlias - Widget Bundle alias
 */
 ThingsboardRestApi.prototype.getBundleWidgetTypesInfosUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/widgetTypesInfos{?bundleAlias,isSystem}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['isSystem'] !== undefined){
                    queryParameters['isSystem'] = parameters['isSystem'];
                }
        
        
        


        if(parameters['isSystem'] === undefined){
            deferred.reject(new Error('Missing required  parameter: isSystem'));
            return deferred.promise;
        }
 

                if(parameters['bundleAlias'] !== undefined){
                    queryParameters['bundleAlias'] = parameters['bundleAlias'];
                }
        
        
        


        if(parameters['bundleAlias'] === undefined){
            deferred.reject(new Error('Missing required  parameter: bundleAlias'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns an array of Widget Type objects that belong to specified Widget Bundle.Widget Type represents the template for widget creation. Widget Type and Widget are similar to class and object in OOP theory. 

Available for users with 'SYS_ADMIN' or 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#getBundleWidgetTypesUsingGET
 * @param {object} parameters - method options and parameters
     * @param {boolean} parameters.isSystem - System or Tenant
     * @param {string} parameters.bundleAlias - Widget Bundle alias
 */
 ThingsboardRestApi.prototype.getBundleWidgetTypesUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/widgetTypes{?bundleAlias,isSystem}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['isSystem'] !== undefined){
                    queryParameters['isSystem'] = parameters['isSystem'];
                }
        
        
        


        if(parameters['isSystem'] === undefined){
            deferred.reject(new Error('Missing required  parameter: isSystem'));
            return deferred.promise;
        }
 

                if(parameters['bundleAlias'] !== undefined){
                    queryParameters['bundleAlias'] = parameters['bundleAlias'];
                }
        
        
        


        if(parameters['bundleAlias'] === undefined){
            deferred.reject(new Error('Missing required  parameter: bundleAlias'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Get the Widget Type based on the provided parameters. Widget Type represents the template for widget creation. Widget Type and Widget are similar to class and object in OOP theory.

Available for any authorized user. 
 * @method
 * @name ThingsboardRestApi#getWidgetTypeUsingGET
 * @param {object} parameters - method options and parameters
     * @param {boolean} parameters.isSystem - System or Tenant
     * @param {string} parameters.bundleAlias - Widget Bundle alias
     * @param {string} parameters.alias - Widget Type alias
 */
 ThingsboardRestApi.prototype.getWidgetTypeUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/widgetType{?alias,bundleAlias,isSystem}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['isSystem'] !== undefined){
                    queryParameters['isSystem'] = parameters['isSystem'];
                }
        
        
        


        if(parameters['isSystem'] === undefined){
            deferred.reject(new Error('Missing required  parameter: isSystem'));
            return deferred.promise;
        }
 

                if(parameters['bundleAlias'] !== undefined){
                    queryParameters['bundleAlias'] = parameters['bundleAlias'];
                }
        
        
        


        if(parameters['bundleAlias'] === undefined){
            deferred.reject(new Error('Missing required  parameter: bundleAlias'));
            return deferred.promise;
        }
 

                if(parameters['alias'] !== undefined){
                    queryParameters['alias'] = parameters['alias'];
                }
        
        
        


        if(parameters['alias'] === undefined){
            deferred.reject(new Error('Missing required  parameter: alias'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Create or update the Widget Bundle. Widget Bundle represents a group(bundle) of widgets. Widgets are grouped into bundle by type or use case.  When creating the bundle, platform generates Widget Bundle Id as [time-based UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_1_(date-time_and_MAC_address)). The newly created Widget Bundle Id will be present in the response. Specify existing Widget Bundle id to update the Widget Bundle. Referencing non-existing Widget Bundle Id will cause 'Not Found' error.

Widget Bundle alias is unique in the scope of tenant. Special Tenant Id '13814000-1dd2-11b2-8080-808080808080' is automatically used if the create bundle request is sent by user with 'SYS_ADMIN' authority.

Available for users with 'SYS_ADMIN' or 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#saveWidgetsBundleUsingPOST
 * @param {object} parameters - method options and parameters
     * @param {} parameters.body -  ThingsBoard open-source IoT platform REST API documentation.
 */
 ThingsboardRestApi.prototype.saveWidgetsBundleUsingPOST = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/widgetsBundle';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        
        
        
            if(parameters['body'] !== undefined){
                body = parameters['body'];
            }


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Get the Widget Bundle based on the provided Widget Bundle Id. Widget Bundle represents a group(bundle) of widgets. Widgets are grouped into bundle by type or use case. 

Available for any authorized user. 
 * @method
 * @name ThingsboardRestApi#getWidgetsBundleByIdUsingGET
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.widgetsBundleId - A string value representing the widget bundle id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.getWidgetsBundleByIdUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/widgetsBundle/{widgetsBundleId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{widgetsBundleId}', parameters['widgetsBundleId']);
        
        


        if(parameters['widgetsBundleId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: widgetsBundleId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Deletes the widget bundle. Referencing non-existing Widget Bundle Id will cause an error.

Available for users with 'SYS_ADMIN' or 'TENANT_ADMIN' authority.
 * @method
 * @name ThingsboardRestApi#deleteWidgetsBundleUsingDELETE
 * @param {object} parameters - method options and parameters
     * @param {string} parameters.widgetsBundleId - A string value representing the widget bundle id. For example, '784f394c-42b6-435a-983c-b7beff2784f9'
 */
 ThingsboardRestApi.prototype.deleteWidgetsBundleUsingDELETE = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/widgetsBundle/{widgetsBundleId}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        
            path = path.replace('{widgetsBundleId}', parameters['widgetsBundleId']);
        
        


        if(parameters['widgetsBundleId'] === undefined){
            deferred.reject(new Error('Missing required  parameter: widgetsBundleId'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns an array of Widget Bundle objects that are available for current user.Widget Bundle represents a group(bundle) of widgets. Widgets are grouped into bundle by type or use case.  

Available for any authorized user. 
 * @method
 * @name ThingsboardRestApi#getWidgetsBundlesUsingGET
 * @param {object} parameters - method options and parameters
 */
 ThingsboardRestApi.prototype.getWidgetsBundlesUsingGET = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/widgetsBundles';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Returns a page of Widget Bundle objects available for current user. Widget Bundle represents a group(bundle) of widgets. Widgets are grouped into bundle by type or use case.  You can specify parameters to filter the results. The result is wrapped with PageData object that allows you to iterate over result set using pagination. See the 'Model' tab of the Response Class for more details. 

Available for any authorized user. 
 * @method
 * @name ThingsboardRestApi#getWidgetsBundlesUsingGET_1
 * @param {object} parameters - method options and parameters
     * @param {integer} parameters.pageSize - Maximum amount of entities in a one page
     * @param {integer} parameters.page - Sequence number of page starting from 0
     * @param {string} parameters.textSearch - The case insensitive 'substring' filter based on the widget bundle title.
     * @param {string} parameters.sortProperty - Property of entity to sort by
     * @param {string} parameters.sortOrder - Sort order. ASC (ASCENDING) or DESC (DESCENDING)
 */
 ThingsboardRestApi.prototype.getWidgetsBundlesUsingGET_1 = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/api/widgetsBundles{?page,pageSize,sortOrder,sortProperty,textSearch}';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];


                if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                }
        
        
        


        if(parameters['pageSize'] === undefined){
            deferred.reject(new Error('Missing required  parameter: pageSize'));
            return deferred.promise;
        }
 

                if(parameters['page'] !== undefined){
                    queryParameters['page'] = parameters['page'];
                }
        
        
        


        if(parameters['page'] === undefined){
            deferred.reject(new Error('Missing required  parameter: page'));
            return deferred.promise;
        }
 

                if(parameters['textSearch'] !== undefined){
                    queryParameters['textSearch'] = parameters['textSearch'];
                }
        
        
        


 

                if(parameters['sortProperty'] !== undefined){
                    queryParameters['sortProperty'] = parameters['sortProperty'];
                }
        
        
        


 

                if(parameters['sortOrder'] !== undefined){
                    queryParameters['sortOrder'] = parameters['sortOrder'];
                }
        
        
        


 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };

    return ThingsboardRestApi;
})();

exports.ThingsboardRestApi = ThingsboardRestApi;
