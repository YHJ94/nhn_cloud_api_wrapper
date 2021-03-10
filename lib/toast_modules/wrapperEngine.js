const toast = require('./toast');

async function instanceBlockStorageUsage(tenantId, apiCredential) {

    var final = {
        header: {
            'isSuccessful': '',
            'resultCode': '',
            'resultMessage': '',
            'errorDetail': ''
        }
    };
    
    ///////////////
    // Get token //
    ///////////////
    var token_response = await toast.getToken(tenantId, apiCredential);
    // Failed
    if (!token_response.header.isSuccessful) {
        final.header.isSuccessful = false;
        final.header.resultCode = 9999;
        final.header.resultMessage = 'Failed to aquire access token';
        final.header.errorDetail = token_response.header.resultMessage;

        return final;
    }

    var tokenId = token_response.token.id;

    /////////////////////////////
    // Get total instance list //
    /////////////////////////////
    var instanceList_response = await toast.getInstanceList(tenantId, tokenId);
    // Failed
    if (!instanceList_response.header.isSuccessful) {
        final.header.isSuccessful = false;
        final.header.resultCode = 100001;
        final.header.resultMessage = 'Failed to aquire instance list';
        final.header.errorDetail = instanceList_response.header.resultMessage;

        return final;
    }

    var instanceList = instanceList_response.servers;

    /////////////////////////////////////////////
    // Get OS volume attachments & volume info //
    /////////////////////////////////////////////

    // Define usage data list
    var blockStorageUsage = [];

    // Iterate via total instance list
    for (index in instanceList) {
        // Pick one
        var instance = instanceList[index];

        // Get attachments
        var attachments_response = await toast.getOsVolumeAttachments(tenantId, instance.id, tokenId);
        // Failed
        if (!attachments_response.header.isSuccessful) {
            final.header.isSuccessful = false;
            final.header.resultCode = 129009;
            final.header.resultMessage = 'Failed to aquire volume attachments';
            final.header.errorDetail = attachments_response.header.resultMessage;

            return final;
        }

        var attachments = attachments_response.volumeAttachments;

        // Volume size
        var totalVolumeSize = 0;

        // Get attached volume information
        // Iterate via attachments
        for (volumeIndex in attachments) {
            // Pick one
            var volume = attachments[volumeIndex];

            // Get volume information
            var volume_response = await toast.getVolume(tenantId, volume.volumeId, tokenId);

            // Failed
            if (!volume_response.header.isSuccessful) {
                final.header.isSuccessful = false;
                final.header.resultCode = 121000;
                final.header.resultMessage = 'Failed to aquire volume information';
                final.header.errorDetail = volume_response.header.resultMessage;

                return final;
            }

            var volumeSize = volume_response.volume.size;
            
            // Sum volume size
            totalVolumeSize = totalVolumeSize + volumeSize;
        }

        // Define each instance usage
        var usage = {
            'name': instance.name,
            'id': instance.id,
            'storageUsage': totalVolumeSize
        };

        // Push each usage into usage data list
        blockStorageUsage.push(usage);

    }

    // Final success response
    final.header.isSuccessful = true;
    final.header.resultCode = 0;
    final.header.resultMessage = 'SUCCESS';
    final.response = blockStorageUsage;
    
    return final;
}

module.exports = {
    instanceBlockStorageUsage
}