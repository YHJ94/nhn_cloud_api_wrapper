const apiAdapter = require('./apiAdapter');

// API endpoint
const COMPUTE_BASE_URL = 'https://kr1-api-instance.infrastructure.cloud.toast.com/';
const IMAGE_BASE_URL = 'https://kr1-api-image.infrastructure.cloud.toast.com/';
const NETWORK_BASE_URL = 'https://kr1-api-network.infrastructure.cloud.toast.com/';
const VOLUME_BASE_URL = 'https://kr1-api-block-storage.infrastructure.cloud.toast.com/'
const apiVersion = 'v2';
const network_apiVersion = 'v2.0';


async function getToken(tenantId, apiCredential) {

    // Get API credential
    var username = apiCredential.username;
    var password = apiCredential.password;
    
    // Request body for Token API
    var url = 'https://api-identity.infrastructure.cloud.toast.com/v2.0/tokens';
    var headers = {
        'Content-Type': 'application/json;charset=UTF-8'
    };
    var data = {
        'auth': {
            'tenantId': tenantId,
            'passwordCredentials': {
                'username': username,
                'password': password
            }
        }
    };
    
    // Response template 
    var final = {
        'header': {
            'requestUUID': 'internal',
            'isSuccessful': '',
            'resultCode': '',
            'resultMessage': ''
        }
    };
    
    // Token initiation 
    var res = await apiAdapter.POST(url, headers, data);
    if (res.access == undefined) {
        // Fail exception
        var res = res.response.data;
        if (res.error.code == 500) {
            final.header.isSuccessful = false;
            final.header.resultCode = 1;
            final.header.resultMessage = res.error.message;
        } else if (res.error.code == 401) {
            final.header.isSuccessful = false;
            final.header.resultCode = -1;
            final.header.resultMessage = res.error.message;
        } else {
            final.header.isSuccessful = false;
            final.header.resultCode = 2;
            final.header.resultMessage = 'UNKNOWN ERROR';
        }
    } else {
        // Success response
        final.header.isSuccessful = true;
        final.header.resultCode = 0;
        final.header.resultMessage = 'SUCCESS';
        var tokenData = res.access.token;
        final.token = tokenData;
    }

    return final;
}

async function getOsVolumeAttachments(tenantId, instanceId, tokenId) {

    // Request url
    var url = COMPUTE_BASE_URL + apiVersion + '/' + tenantId + '/servers/' + instanceId + '/os-volume_attachments';
    var headers = {
        'X-Auth-Token': tokenId
    };

    // Response template 
    var final = {
        'header': {
            'requestUUID': 'internal',
            'isSuccessful': '',
            'resultCode': '',
            'resultMessage': ''
        }
    };

    // API request
    var res = await apiAdapter.GET(url, headers);
    if (res.volumeAttachments == undefined) {
        // Fail exception
        if (res.response.status == 400) {
            final.header.isSuccessful = false;
            final.header.resultCode = 1;
            final.header.resultMessage = res.response.data.badRequest.message;
        } else if (res.response.status == 404) {
            final.header.isSuccessful = false;
            final.header.resultCode = -1;
            final.header.resultMessage = 'Not Found';
        } else {
            final.header.isSuccessful = false;
            final.header.resultCode = 2;
            final.header.resultMessage = 'UNKNOWN ERROR';
        }
    } else {
        // Success response
        final.header.isSuccessful = true;
        final.header.resultCode = 0;
        final.header.resultMessage = 'SUCCESS';
        final.volumeAttachments = res.volumeAttachments;
    }

    return final;
}

async function getInstanceList(tenantId, tokenId) {

    // Request url
    var url = COMPUTE_BASE_URL + apiVersion + '/' + tenantId + '/servers';
    var headers = {
        'X-Auth-Token': tokenId
    };

    // Response template 
    var final = {
        'header': {
            'requestUUID': 'internal',
            'isSuccessful': '',
            'resultCode': '',
            'resultMessage': ''
        }
    };

    // API request
    var res = await apiAdapter.GET(url, headers);
    if (res.servers == undefined) {
        // Fail execption
        if (res.response.status == 400) {
            final.header.isSuccessful = false;
            final.header.resultCode = 1;
            final.header.resultMessage = res.response.data.badRequest.message;
        } else if (res.response.status == 404) {
            final.header.isSuccessful = false;
            final.header.resultCode = -1;
            final.header.resultMessage = 'Not Found';
        } else {
            final.header.isSuccessful = false;
            final.header.resultCode = 2;
            final.header.resultMessage = 'UNKNOWN ERROR';
        }
    }
    // Successed, but there is no instance
    else if (res.servers.length <= 0) {
        final.header.isSuccessful = false;
        final.header.resultCode = 3;
        final.header.resultMessage = 'There is no instance';
    }
    // Success for sure 
    else {
        // Success response
        final.header.isSuccessful = true;
        final.header.resultCode = 0;
        final.header.resultMessage = 'SUCCESS';
        final.servers = res.servers;
    }

    return final;
}

async function getVolume(tenantId, volumeId, tokenId) {

    // Request url
    var url = VOLUME_BASE_URL + apiVersion + '/' + tenantId + '/volumes/' + volumeId;
    var headers = {
        'X-Auth-Token': tokenId
    };

    // Response template 
    var final = {
        'header': {
            'requestUUID': 'internal',
            'isSuccessful': '',
            'resultCode': '',
            'resultMessage': ''
        }
    };

    // API request
    var res = await apiAdapter.GET(url, headers);
    if (res.volume == undefined) {
        // Fail execption
        if (res.response.status == 400) {
            final.header.isSuccessful = false;
            final.header.resultCode = 1;
            final.header.resultMessage = res.response.data.badRequest.message;
        } else if (res.response.status == 404) {
            final.header.isSuccessful = false;
            final.header.resultCode = -1;
            final.header.resultMessage = 'Not Found';
        } else {
            final.header.isSuccessful = false;
            final.header.resultCode = 2;
            final.header.resultMessage = 'UNKNOWN ERROR';
        }
    } else {
        // Success response
        final.header.isSuccessful = true;
        final.header.resultCode = 0;
        final.header.resultMessage = 'SUCCESS';
        final.volume = res.volume;
    }

    return final;
}

module.exports = {
    getToken,
    getOsVolumeAttachments,
    getInstanceList,
    getVolume
}