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
/*
class Toast {

    constructor () {}

    loadConfig() {
        
        // Read Toast config info
        this.auth = configDB.get('authentication').value();
        this.projectInfo = configDB.get('project').value();
        this.orgInfo = configDB.get('org').value();
        
        // Set Static variables
        Toast.tenantId = this.projectInfo.tenantId;
        Toast.appkey = this.auth.appkey;
        Toast.logAppkey = this.auth.logAppkey;
        Toast.username = this.auth.id;
        Toast.password = this.auth.apiPassword;
        Toast.orgName = this.orgInfo.name;

        // Initiate Toast DB file if it is empty
        toastDB.defaults({flavors: [], images: [], networks: [], subnets: []})
               .write();

        // View Flavor info and save into DB
        this.viewFlavor_int();
        // View Image info and save into DB
        this.viewImage_int();
        // View VPC networks info and save into DB
        this.viewVPC_int();
        // View Subnet info and save into DB
        this.viewSubnet_int();

        console.log("toast config loaded");
    }

    async deleteInstance(instanceId) {
        var tokenId = await Token.getTokenId();

        var url = COMPUTE_BASE_URL + apiVersion + '/' + Toast.tenantId + '/servers/' + instanceId;
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Auth-Token': tokenId
        };

        var res = await apiAdapter.DELETE(url, headers);
        this.sendLog("Instance deleted", "instance_log", res);
        return res;
    }

    async createInstance(instanceName, imageName, flavorName, subnets, osVolume, bsVolume, request_uuid) {
        var tokenId = await Token.getTokenId();
        
        var url = COMPUTE_BASE_URL + apiVersion + '/' + Toast.tenantId + '/servers';
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Auth-Token': tokenId
        };

        // API 파라미터 변환함과 동시에 각 파라미터별 error handle
        // Basic error response
        var fail_res = {
            'header': {
                'requestUUID': request_uuid,
                'isSuccessful':false,
                'resultCode':1,
                'resultMessage': ''
            }
        }

        //                                       //
        // Get server name and check it's length //
        //                                       //

        var serverName = instanceName;
        // All or nothing
        
        for(var index in serverName) {
            if(serverName[index].length > 15) {
                fail_res.header.resultMessage = 'Server Name is too long. Length must be under 15';
                this.sendLog('Instance create request', 'instance_log', request_uuid, fail_res);
                return fail_res;
            }
        } 
        
        //                           //
        // Get image ID from DB file //
        //                           //

        // 개인 이미지로 필터링
        var imageList = toastDB.get('images')
                        .filter({visibility: 'private'});
        
        var image = imageList.find({name: imageName})
                        .value();

        // 공유된 또는 공유한 이미지의 경우
        var imageListShared = toastDB.get('images')
                        .filter({visibility: 'shared'});
        
        var imageShared = imageListShared.find({name: imageName})
                        .value();

        // 이미지 조회 실패 시
        if(!image && !imageShared) {
            
            // Update image and try again
            this.viewImage_int();
            
            // Reload image
            imageList = toastDB.get('images')
                        .filter({visibility: 'private'});
            
            image = imageList.find({name: imageName})
                        .value();

            imageListShared = toastDB.get('images')
                        .filter({visibility: 'shared'});
        
            imageShared = imageListShared.find({name: imageName})
                        .value();

            // 이미지 조회에 두 번 모두 실패 했을 경우
            if(!image && !imageShared) {
                fail_res.header.resultMessage = 'Cannot find requesting image';
                this.sendLog('Instance create request', 'instance_log', request_uuid, fail_res);
                return fail_res;
            }
        } 
            
        // private 이미지일 경우
        if(image) {
            var imageId = image.id;
        }
        // shared 이미지일 경우
        else if(imageShared) {
            var imageId = imageShared.id;
        }
        
        //                            //
        // Get flavor ID from DB file //
        //                            //

        // Check accepted list first
        var accepted_flavor_type = vdiConf.get('accepted_flavor_type').value();
        if(accepted_flavor_type.indexOf(flavorName) < 0) {
            fail_res.header.resultMessage = 'Cannot find requesting flavor type or not supported for VDI';
            this.sendLog('Instance create request', 'instance_log', request_uuid, fail_res);
            return fail_res;
        } else {
            var flavorId = toastDB.get('flavors')
                            .find({name: flavorName})
                            .value().id;
        }

        //                            // 
        // Get subnet ID from DB file //
        //                            //

        // Subnet request body 데이터
        var subnetData = [];
        
        // DHCP 할당된 서브넷만 조회
        var subnetList = toastDB.get('subnets')
                        .filter({enable_dhcp: true});
        index = 0;
        for(index in subnets) {
            // request 파라미터로 들어온 subnet을 subnetList에서 조회
            var subnet = subnetList.find({name: subnets[index].name})
                        .value();
            // subnetList에서 조회되지 않았을 경우
            // All or nothing                        
            if(!subnet) {
                fail_res.header.resultMessage = 'Cannot find requesting subnet';
                this.sendLog('Instance create request', 'instance_log', request_uuid, fail_res);
                return fail_res;
            }
            // subnet 정보가 hit 했을 경우 
            else {
                var subnetId = {
                    'subnet': subnet.id
                }
                // subnet request body 
                subnetData.push(subnetId);
            }
        }

        //                                         // 
        // Get default SSH key name from Conf file //
        //                                         //
        
        var keyName = vdiConf.get('key').value();

        //                            //
        // Set Block storage settings //
        //                            //

        // Block device request data list
        var block_device_mapping_data = [];

        // Root volume
        var root_block_device_uuid = imageId;
        var root_block_device_source_type = 'image';
        var root_block_device_destination_type = 'volume';
        var root_block_device_delete_on_termination = 1;
        var root_block_device_boot_index = 0;
        var root_block_device_name = 'vda';
        
        // Root volume size
        if(osVolume == "default") {
            // Request is empty == use default option
            var root_block_device_volume_size = vdiConf.get('root_volume_size').value();
        } else {
            var root_block_device_volume_size = osVolume;
        }

        // Root block device data
        var rootDeviceData =  {
            'uuid': root_block_device_uuid,
            'boot_index': root_block_device_boot_index,
            'source_type': root_block_device_source_type,
            'destination_type': root_block_device_destination_type,
            'delete_on_termination': root_block_device_delete_on_termination,
            'device_name': root_block_device_name,
            'volume_size': root_block_device_volume_size
        }
        // Push root device data into device mapping data
        block_device_mapping_data.push(rootDeviceData);
        
        // Set block storage data if bsVolume size isn't 0
        if(bsVolume != 0) {
            // Block Storage volume
            var bs_block_device_uuid = imageId;
            var bs_block_device_source_type = 'image';
            var bs_block_device_destination_type = 'volume';
            var bs_block_device_delete_on_termination = 1;
            var bs_block_device_boot_index = 1;
            var bs_block_device_name = 'vdb';
        
            // Block Storage volume size
            if(bsVolume == "default") {
                // Request is empty == use default option
                var bs_block_device_volume_size = vdiConf.get('bs_volume_size').value();
            } else {
                var bs_block_device_volume_size = bsVolume;
            }

            // Block storage device data
            var bsDeviceData = {
                'uuid': bs_block_device_uuid,
                'boot_index': bs_block_device_boot_index,
                'source_type': bs_block_device_source_type,
                'destination_type': bs_block_device_destination_type,
                'delete_on_termination': bs_block_device_delete_on_termination,
                'device_name': bs_block_device_name,
                'volume_size': bs_block_device_volume_size,
            }
            // Push block storage device data into device mapping data
            block_device_mapping_data.push(bsDeviceData);
        }

        //                                            //
        // Get Security group settings from Conf file //
        //                                            //

        var securityGroups = vdiConf.get('securityGroups').value();

        //                                                    //
        // Get userdata from Conf file and Encode into BASE64 //
        //                                                    //

        var userData = fs.readFileSync(filePath);
        var userDataEncoded = Buffer.from(userData).toString('base64');

        //                              //
        // create data and send request //
        //                              //
        
        // API request result data list
        var res_data = [];
        
        // send request quantity is determined by requested server names
        for(var index in serverName) {
            
            // request data
            var data = {
                'server': {
                    'name': serverName[index],
                    'imageRef': imageId,
                    'flavorRef': flavorId,
                    'networks': subnetData,
                    'key_name': keyName,
                    'block_device_mapping_v2': block_device_mapping_data,
                    'security_groups': securityGroups,
                    'user_data': userDataEncoded
                }
            }
            
            // send request
            var res = await apiAdapter.POST(url, headers, data);

            // api request response가 400 또는 404 error일 경우
            // all or nothing
            if(res.response != undefined) {
                
                // Transaction
                if(index >= 1) {
                    // 생성 성공한 인스턴스가 있는 상태에서 두번 째 시도 이상부터 실패할 경우
                    res = {
                        'header': {
                            'isSuccessful': false,
                            'resultCode': 1,
                            'resultMessage': 'Request failed with status code 400/404',
                            'rawComputeMessage' : res.response.data
                        },
                        'body': {
                            'data': {
                                'name': serverName[index],
                                'uuid': 'Instance creation failed',
                                'status': 'NONE'
                            }
                        }
                    }
                    res_data.push(res);
                    var isSuccessful_final = false;
                    var resultCode_final = 1;
                    var resultMessage_final = 'Total job has failed. Transaction Start';
                    break;

                } // 첫번 째 생성시도부터 실패할 경우 
                else if(res.response.status == 400 || res.response.status == 404) {
                    res = {
                        'header': {
                            'isSuccessful': false,
                            'resultCode': 1,
                            'resultMessage': 'Request failed with status code 400/404',
                            'rawComputeMessage' : res.response.data
                        },
                        'body': {
                            'data': {
                                'name': serverName[index],
                                'uuid': 'Instance creation failed',
                                'status': 'NONE'
                            }
                        }
                    }
                    res_data.push(res);
                    var isSuccessful_final = false;
                    var resultCode_final = 1;
                    var resultMessage_final = 'Total job has failed. Transaction Start';
                    break;
                }
            } else {
                // 생성 성공한 경우
                res = {
                    'header': {
                        'isSuccessful': true,
                        'resultCode': 0,
                        'resultMessage': 'SUCCESS'
                    },
                    'body': {
                        'data': {
                            'name': serverName[index],
                            'uuid': res.server.id,
                            'status': 'BUILD'
                        }
                    }
                }
                res_data.push(res);
                var isSuccessful_final = true;
                var resultCode_final = 0;
                var resultMessage_final = 'SUCCESS'
            }
        }

        // Final response
        var final = {
            'header': {
                'requestUUID': request_uuid,
                'isSuccessful': isSuccessful_final,
                'resultCode': resultCode_final,
                'resultMessage': resultMessage_final
            },
            'servers': res_data
        }
        this.sendLog('Instance create request', 'instance_log', request_uuid, final);
        
        return final;
    }

    async attachFIP(instanceName, fixedIp, floatingIp, request_uuid) {
        
        var tokenId = await Token.getTokenId();
        var url = NETWORK_BASE_URL + network_apiVersion + '/floatingips/'; 
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Auth-Token': tokenId
        };

        // API 파라미터 변환함과 동시에 각 파라미터별 error handle
        // Basic error response
        var fail_res = {
            'header': {
                'requestUUID': request_uuid,
                'isSuccessful':false,
                'resultCode':1,
                'resultMessage': ''
            }
        }

        //                                            //
        // Get Instance infomation from instance name //
        //                                            //
        
        var instanceInfo = await this.viewInstanceFromName_int(instanceName);

        if (!instanceInfo.header.isSuccessful) {
            // If instance search has failed
            fail_res.header.resultMessage = instanceInfo.header.resultMessage;
            this.sendLog('FIP attach request', 'instance_log', request_uuid, fail_res);
            return fail_res;
        }

        //                                            //
        // Get Instance port infomation from fixed IP //
        //                                            //

        // Get instance port infomation

        var instanceUUID = instanceInfo.server.id;
        var portData = await this.viewPort_int(instanceUUID);

        // Get specific port infomation from given fixed IP

        if(fixedIp != "") {
            // If there's requested fixed IP
            var portFound = portData.ports.filter(function(port) {
                return port.fixed_ips[0].ip_address == fixedIp;
            })
        } else {
            // If there's no requested fixed IP, then use random 192 address
            var portFound = portData.ports.filter(function(port) {
                fixedIp = port.fixed_ips[0].ip_address;
                var fixedIp_A = fixedIp.split('.');
                if(fixedIp_A[0] == '192') {
                    return true;
                }
                else {
                    return false;
                }
            })
        }

        // If port has not found
        if(portFound.length == 0) {
            fail_res.header.resultMessage = 'Available port(fixed IP) not found';
            this.sendLog('FIP attach request', 'instance_log', request_uuid, fail_res);
            return fail_res;
        }

        var portInfo = portFound[0];
        var portId = portInfo.id;

        //                                            //
        // Get Floating IP infomation from IP address //
        //                                            //

        // Get floating IP infomation from given floating IP

        if(floatingIp != "") {
            // If there's requested floating IP
            var floatingIpData = await this.viewFIP_int(floatingIp);
            
            // If FIP has not found
            if(!floatingIpData.header.isSuccessful) {
                fail_res.header.resultMessage = floatingIpData.header.resultMessage;
                this.sendLog('FIP attach request', 'instance_log', request_uuid, fail_res);
                return fail_res;
            } else {
                // FIP id
                var floatingIpId = floatingIpData.floatingIp.id;
            }
        } else {
            // If there's no given fip address, then create one
            var floatingIpData = await this.createFIP_int();
            
            // If create FIP has failed
            if(!floatingIpData.header.isSuccessful) {
                fail_res.header.resultMessage = floatingIpData.header.resultMessage;
                this.sendLog('FIP attach request', 'instance_log', request_uuid, fail_res);
                return fail_res;
            } else {
                // FIP id
                var floatingIpId = floatingIpData.floatingIp.id;
            }
        }

        //                    //
        // Attach floating IP //
        //                    //

        // Remake request url
        url = url + floatingIpId;

        // Set request body
        var data = {
            'floatingip': {
                'port_id': portId
            }
        };

        // Send request
        var res = await apiAdapter.PUT(url, headers, data);

        // Failed
        if(res.floatingip == undefined) {
            fail_res.header.resultMessage = res.response.data.NeutronError.message;
            this.sendLog('FIP attach request', 'instance_log', request_uuid, fail_res);

            // If floating IP was created from fip attach request, then delete created one
            if(floatingIp == "") {
                // 요청 받은 fip가 없다면 fip를 하나 생성했다는 뜻이므로
                apiAdapter.DELETE(url, headers);
                res = {
                    'header': {
                        'requestUUID': request_uuid,
                        'resultMessage': 'Created FIP deleted'
                    }
                }
                this.sendLog('FIP attach request', 'instance_log', request_uuid, res);
            }

            return fail_res;

        } else {
            var final = {
                'header': {
                    'requestUUID': request_uuid,
                    'isSuccessful': true,
                    'resultCode': 0,
                    'resultMessage': "SUCCESS"
                },
                'floatingIp': {
                    'fixed_ip_address': res.floatingip.fixed_ip_address,
                    'floating_ip_address': res.floatingip.floating_ip_address,
                    'status': res.floatingip.status
                }
            };
        }

        this.sendLog('FIP attach request', 'instance_log', request_uuid, final);
        
        return final;

    }

    async dupSecurityGroups(securityGroups, targetInfo, request_uuid) {
        
        // Basic error response
        var fail_res = {
            'header': {
                'requestUUID': request_uuid,
                'isSuccessful':false,
                'resultCode':1,
                'resultMessage': ''
            }
        }

        // Final response data
        var final = {
            'header': {
                'requestUUID': request_uuid,
                'isSuccessful': '',
                'resultCode': '',
                'resultMessage': ''
            }
        };

        //                            //
        // Check VERY basic exception //
        //                            //

        // Check whether source tenant and target tenant are same
        var sourceTenantId = configDB.get('project').value().tenantId;
        if(sourceTenantId == targetInfo.tenantId) {
            fail_res.header.resultMessage = "Source tenant and target tenant can not be the same";

            this.sendLog('Security group duplication request', 'network_log', request_uuid, fail_res);
            
            return fail_res;
        }

        // Get both token
        var sourceTokenId = await Token.getTokenId();

        var targetToken = await this.getTokenIdManual(targetInfo.tenantId, targetInfo.credential);
        if(!targetToken.header.isSuccessful) {
            // Failed to aquire target tenant's token
            fail_res.header.resultMessage = "Target credential is invalid";
            fail_res.header.rawComputeMessage = targetToken.header.resultMessage;

            this.sendLog('Security group duplication request', 'network_log', request_uuid, fail_res);
            return fail_res;
        }
        var targetTokenId = targetToken.token.id;

        // Validate & Search requested security groups and store it in array (if it is valid)
        var sourceSecurityGroupData = [];

        for(var i = 0; i < securityGroups.length; i++) {
            var item = securityGroups[i];
            var securityGroupName = item.name;

            // View 
            var securityGroupData = await this.viewSecurityGroup_int(securityGroupName, sourceTokenId);
            
            // Failed
            if(!securityGroupData.header.isSuccessful) {
                fail_res.header.resultMessage = "Failed to aquire requested security group data";
                fail_res.header.rawComputeMessage = securityGroupData.header.resultMessage;

                this.sendLog('Security group duplication request', 'network_log', request_uuid, fail_res);
                return fail_res;
            } 
            // Success
            else {
                // Stack security group data
                securityGroupData.securityGroup.userReqData = item;
                sourceSecurityGroupData.push(securityGroupData.securityGroup);
            }

        }

        // Iterate and process
        var failCount = 0;
        final.securityGroups = [];

        for(var i = 0; i < sourceSecurityGroupData.length; i++) {

            // Individual job response
            var responseData = {
                'header': {
                    'isSuccessful': '',
                    'resultCode': '',
                    'resultMessage': ''
                },
                'body': {
                    'targetSecurityGroup': {
                        'name': '',
                        'id': '',
                        'status': ''
                    }
                }
            };

            var item = sourceSecurityGroupData[i];
            securityGroupName = item.name;

            /// Search and create ///

            // Search security group in target tenant
            var targetSecurityGroupId = '';
            var securityGroupData = await this.viewSecurityGroup_int(securityGroupName, targetTokenId);
            
            // Just failed
            if(!securityGroupData.header.isSuccessful && !(securityGroupData.header.resultCode == 2)) {
                responseData.header.isSuccessful = false;
                responseData.header.resultCode = 1;
                responseData.header.resultMessage = "Failed to create security group on target tenant";
                responseData.header.rawComputeMessage = securityGroupData.header.resultMessage;

                responseData.body.targetSecurityGroup.name = securityGroupName;
                responseData.body.targetSecurityGroup.status = 'ABORT';

                // Stack individual job data into final response
                final.securityGroups.push(responseData);

                // Increment fail count
                failCount = failCount + 1;

                // Abort this job
                continue;
            }
            // Request successed, which means overwrite the old one or return as fail
            else if(securityGroupData.header.isSuccessful) {
                var isOverwrite = item.userReqData.overwrite;
                
                // Overwrite option is enabled
                if(isOverwrite) {
                    // Iterate and delete the old security group rules
                    for(var index in securityGroupData.securityGroup.security_group_rules) {
                        var targetRule = securityGroupData.securityGroup.security_group_rules[index];
                        
                        // Delete
                        await this.deleteSecurityGroupRule_int(targetRule.id, targetTokenId);
                    }
                    
                    targetSecurityGroupId = securityGroupData.securityGroup.id;
                }
                // Overwrite option is disabled or not configured 
                else {
                    responseData.header.isSuccessful = false;
                    responseData.header.resultCode = 2;
                    responseData.header.resultMessage = "Failed to create security group on target tenant";
                    responseData.header.rawComputeMessage = "Security group [" + securityGroupName + '] already exisists on target tenant. Use overwrite option to overwrite this group and force to duplicate';

                    responseData.body.targetSecurityGroup.name = securityGroupName;
                    responseData.body.targetSecurityGroup.status = 'ABORT';

                    // Stack individual job data into final response
                    final.securityGroups.push(responseData);

                    // Increment fail count
                    failCount = failCount + 1;

                    // Abort this job
                    continue;
                }
            }
            // Request failed with no data, which means available to create one
            else if (securityGroupData.header.resultCode == 2) {
                
                // Create security group on target tenant
                var data = {
                    'name': securityGroupName,
                    'description': item.description
                };

                var targetSecurityGroup = await this.createSecurityGroup_int(data, targetTokenId);
                // Failed
                if(!targetSecurityGroup.header.isSuccessful) {
                    responseData.header.isSuccessful = false;
                    responseData.header.resultCode = 3;
                    responseData.header.resultMessage = targetSecurityGroup.header.resultMessage;
                    if(targetSecurityGroup.header.errorDetail != undefined) {
                        responseData.header.rawComputeMessage = targetSecurityGroup.header.errorDetail;
                    }

                    responseData.body.targetSecurityGroup.name = securityGroupName;
                    responseData.body.targetSecurityGroup.status = 'DELETED';

                    // Stack individual job data into final response
                    final.securityGroups.push(responseData);
                    
                    // Increment fail count
                    failCount = failCount + 1;

                    continue;
                }
                // Success
                else {
                    targetSecurityGroupId = targetSecurityGroup.securityGroup.id;
                }
            }

            /// Iterate and create (duplicate) security group rules ///
            var userReqData = item.userReqData;
            var rules = item.security_group_rules;
            var cachedRemoteGroupData = {};
            var cachedTargetRemoteGroupData = {};
            var isRuleFailed = false;

            for(var ruleIndex in rules) {
                var rule = rules[ruleIndex];

                // Generate security group rule data
                var data = {
                    'direction': rule.direction,
                    'ethertype': rule.ethertype,
                    'protocol': rule.protocol,
                    'description': rule.description,
                    'port_range_min': rule.port_range_min,
                    'port_range_max': rule.port_range_max,
                    'security_group_id': targetSecurityGroupId
                }

                // Decide remote ip prefix of remote group id
                
                // Case 1 : There is no given remote ip or remote group name to change
                if(userReqData.remote_ip_address == undefined && userReqData.remote_group_name == undefined) {
                    // Decide remote ip
                    // Just duplicate the old one
                    data.remote_ip_prefix = rule.remote_ip_prefix;

                    // Decide remote group id
                    // If remote group id is equal to security group id
                    if(rule.remote_group_id == rule.security_group_id) {
                        data.remote_group_id = targetSecurityGroupId;
                    }
                    // If remote group id is null (which is default value of security group rule)
                    else if(rule.remote_group_id == null) {
                        data.remote_group_id = null;
                    }
                    // Source security group rules is mashed
                    else {
                        // First, aquire remote group name from source
                        // Search cache first
                        if(cachedRemoteGroupData[rule.remote_group_id] == undefined) {
                            // No hit
                            var sourceRemoteGroupData = await this.viewSecurityGroupById_int(rule.remote_group_id, sourceTokenId);
                            var sourceRemoteGroupName = sourceRemoteGroupData.securityGroup.name;
                            cachedRemoteGroupData[rule.remote_group_id] = sourceRemoteGroupName;
                        } else {
                            // Cache hit
                            var sourceRemoteGroupName = cachedRemoteGroupData[rule.remote_group_id];
                        }

                        // Then, search that name on target
                        // Search cache first
                        if(cachedTargetRemoteGroupData[sourceRemoteGroupName] == undefined) {
                            // No hit
                            var targetRemoteGroupData = await this.viewSecurityGroup_int(sourceRemoteGroupName, targetTokenId);
                            if(!targetRemoteGroupData.header.isSuccessful) {
                                // whether there is no data or api call just failed, abort this job and start transaction.
                                responseData.header.isSuccessful = false;
                                responseData.header.resultCode = 4;
                                responseData.header.resultMessage = "Failed to duplicate security group rule because there is invalid remote group name [" + sourceRemoteGroupName + '].';
                                responseData.header.rawComputeMessage = targetRemoteGroupData.resultMessage;

                                responseData.body.targetSecurityGroup.name = securityGroupName;
                                responseData.body.targetSecurityGroup.status = 'DELETED';
                                
                                // Enable fail flag
                                isRuleFailed = true;

                                break;
                            } else {
                                // Store it to cache
                                cachedTargetRemoteGroupData[sourceRemoteGroupName] = targetRemoteGroupData.securityGroup.id;
                                // Remote group id decided
                                data.remote_group_id = targetRemoteGroupData.securityGroup.id;
                            }
                        } else {
                            // Cache hit
                            data.remote_group_id = cachedTargetRemoteGroupData[sourceRemoteGroupName];
                        } 
                    }

                    // Create rule
                    this.createSecurityGroupRule_int(data, targetTokenId);
                }
                // Case 2: There is given remote ip or remote group name to change so, replace the ip or group name
                else {

                    // Prepare for iteration
                    if(userReqData.remote_ip_address == undefined) {
                        userReqData.remote_ip_address = [];
                    }
                    if(userReqData.remote_group_name == undefined) {
                        userReqData.remote_group_name = [];
                    }

                    // Rule has remote ip prefix
                    if(rule.remote_group_id == null) {

                        var isMatchFound = false;
                        data.remote_group_id = null;

                        // Iterate via given requested remote ip addresses
                        for(var index in userReqData.remote_ip_address) {
                            var replaceTarget = userReqData.remote_ip_address[index];
                            
                            // Search for match
                            if(rule.remote_ip_prefix == replaceTarget.previous) {
                                // If match found, replace ip address
                                data.remote_ip_prefix = replaceTarget.adjective;
                                isMatchFound = true;
                                break;
                            }
                        }

                        // No match, use original ip address
                        if(!isMatchFound) {
                            data.remote_ip_prefix = rule.remote_ip_prefix;
                        }

                        // Create rule
                        this.createSecurityGroupRule_int(data, targetTokenId);
                    }
                    // Rule has remote group id
                    else {

                        var isMatchFound = false;
                        var isRemoteFailed = false;
                        data.remote_ip_prefix = null;

                        // Aquire source remote group name
                        // Search data in cache first
                        if(cachedRemoteGroupData[rule.remote_group_id] == undefined) {
                            // No hit
                            // Aquire remote group name from original security group id
                            var sourceRemoteGroupData = await this.viewSecurityGroupById_int(rule.remote_group_id, sourceTokenId);
                            var sourceRemoteGroupName = sourceRemoteGroupData.securityGroup.name;
                            cachedRemoteGroupData[rule.remote_group_id] = sourceRemoteGroupName;
                        } else {
                            // Cache hit
                            var sourceRemoteGroupName = cachedRemoteGroupData[rule.remote_group_id];
                        }

                        // Iterate via given requested remote group name
                        for(var sgIndex in userReqData.remote_group_name) {
                            var replaceTarget = userReqData.remote_group_name[sgIndex];

                            // Search for match
                            // If match found, replace remote group name
                            if(sourceRemoteGroupName == replaceTarget.previous) {

                                // Validate whether replacing remote group is exist on target tenant
                                var targetGroupName = replaceTarget.adjective;
                                
                                // Search data in cache first
                                if(cachedTargetRemoteGroupData[targetGroupName] == undefined) {
                                    // No hit
                                    // Aquire remote group information from target security group
                                    var targetRemoteGroupData = await this.viewSecurityGroup_int(targetGroupName, targetTokenId);
                                    if(!targetRemoteGroupData.header.isSuccessful) {
                                        // Search failed, abort this job and start transaction
                                        responseData.header.isSuccessful = false;
                                        responseData.header.resultCode = 5;
                                        responseData.header.resultMessage = "Failed to duplicate and replace security group rule because there is invalid remote group name [" + targetGroupName + '].';
                                        responseData.header.rawComputeMessage = targetRemoteGroupData.resultMessage;

                                        responseData.body.targetSecurityGroup.name = securityGroupName;
                                        responseData.body.targetSecurityGroup.status = 'DELETED';
                                        
                                        // Enable fail flag
                                        isRemoteFailed = true;
                    
                                        break;
                                    } else {
                                        // Search success
                                        data.remote_group_id = targetRemoteGroupData.securityGroup.id;
                                        // Store this data into cache
                                        cachedTargetRemoteGroupData[targetGroupName] = targetRemoteGroupData.securityGroup.id;
                                        
                                        isMatchFound = true;
                                        break;
                                    }
                                } else {
                                    // Cache hit
                                    data.remote_group_id = cachedTargetRemoteGroupData[targetGroupName];

                                    isMatchFound = true;
                                    break;
                                }
                            }
                        }

                        if(isRemoteFailed) {
                            // This rule has failed, so this job has failed
                            isRuleFailed = true;
                            break;
                        } else if (!isMatchFound) {
                            // No match found, use original remote group name
                            if(rule.remote_group_id == rule.security_group_id) {
                                data.remote_group_id = targetSecurityGroupId;
                            }
                            // Security group rule is mashed
                            else {
                                // Validate whether original remote group is exist on target tenant

                                // Search data in cache first
                                if(cachedTargetRemoteGroupData[sourceRemoteGroupName] == undefined) {
                                    // No hit
                                    // Aquire remote group information from target security group
                                    var targetRemoteGroupData = await this.viewSecurityGroup_int(sourceRemoteGroupName, targetTokenId);
                                    if(!targetRemoteGroupData.header.isSuccessful) {
                                        // Search failed, abort this job and start transaction
                                        responseData.header.isSuccessful = false;
                                        responseData.header.resultCode = 6;
                                        responseData.header.resultMessage = "Failed to duplicate and replace security group rule because there is invalid remote group name [" + sourceRemoteGroupName + '].';
                                        responseData.header.rawComputeMessage = targetRemoteGroupData.resultMessage;

                                        responseData.body.targetSecurityGroup.name = securityGroupName;
                                        responseData.body.targetSecurityGroup.status = 'DELETED';
                                        
                                        // Enable fail flag
                                        isRuleFailed = true;
                    
                                        break;
                                    } else {
                                        // Search success
                                        data.remote_group_id = targetRemoteGroupData.securityGroup.id;
                                        // Store this data into cahce
                                        cachedTargetRemoteGroupData[sourceRemoteGroupName] = targetRemoteGroupData.securityGroup.id;
                                    }
                                } else {
                                    // Cache hit
                                    data.remote_group_id = cachedTargetRemoteGroupData[sourceRemoteGroupName];
                                }
                            }
                            
                            // Create rule
                            this.createSecurityGroupRule_int(data, targetTokenId);

                        } else if (isMatchFound) {
                            // Create rule
                            this.createSecurityGroupRule_int(data, targetTokenId);
                        }
                    }
                }
            }

            if(isRuleFailed) {
                // One rule has failed, so abort this job and delete created security group                              
                
                // Delete security group which is created at this job
                this.deleteSecurityGroup_int(targetSecurityGroupId, targetTokenId);

                // Stack individual job data into final response
                final.securityGroups.push(responseData);
                
                // Increment fail count
                failCount = failCount + 1;

                // Go to next job
                continue;
            }

            // individual job success response
            responseData.header.isSuccessful = true;
            responseData.header.resultCode = 0;
            responseData.header.resultMessage = "SUCCESS";

            responseData.body.targetSecurityGroup.name = securityGroupName;
            responseData.body.targetSecurityGroup.id = targetSecurityGroupId;
            responseData.body.targetSecurityGroup.status = "BUILD";

            // Stack individual job data into final response
            final.securityGroups.push(responseData);
        }

        // Final response

        if(failCount == 0) {
            final.header.isSuccessful = true;
            final.header.resultCode = 0;
            final.header.resultMessage = "SUCCESS";
        } else if(failCount > 0 && failCount < sourceSecurityGroupData.length) {
            final.header.isSuccessful = false;
            final.header.resultCode = 1;
            final.header.resultMessage = "PARTIAL SUCCESS";
        } else if(failCount == sourceSecurityGroupData.length) {
            final.header.isSuccessful = false;
            final.header.resultCode = 2;
            final.header.resultMessage = "FAILED";
        }

        return final;
    }


    async createSecurityGroup(securityGroup, securityGroupRules, request_uuid) {
        
        // Basic error response
        var fail_res = {
            'header': {
                'requestUUID': request_uuid,
                'isSuccessful':false,
                'resultCode':1,
                'resultMessage': ''
            }
        };

        // Final response data
        var final = {
            'header': {
                'requestUUID': request_uuid,
                'isSuccessful': '',
                'resultCode': '',
                'resultMessage': ''
            }
        };

        var tokenId = await Token.getTokenId();
        
        // Create security group
        var securityGroupData = await this.createSecurityGroup_int(securityGroup, tokenId);
        if(!securityGroupData.header.isSuccessful) {
            fail_res.header.resultMessage = securityGroupData.header.resultMessage;
            fail_res.header.rawComputeMessage = securityGroupData.header.errorDetail;
            
            this.sendLog('Create security group request', 'network_log', request_uuid, fail_res);
            return fail_res;
        }

        var securityGroup = securityGroupData.securityGroup;

        // There is no requested security group rules
        if(securityGroupRules == '') {
            final.header.isSuccessful = true;
            final.header.resultCode = 0;
            final.header.resultMessage = "SUCCESS";
            final.securityGroup = securityGroup;

            this.sendLog('Create security group request', 'network_log', request_uuid, final);
            return final;
        }

        // Iterate and add requested security group rules
        var securityGroupId = securityGroup.id;

        for(var index in securityGroupRules) {
            var item = securityGroupRules[index];
            
            // Generate request data
            var data = {
                'port_range_min': item.port_range_min,
                'port_range_max': item.port_range_max,
                'ethertype': 'IPv4',
                'protocol': item.protocol,
                'security_group_id': securityGroupId
            };

            // Decide direction
            if((item.direction).toLowerCase() == 'inbound') {
                data.direction = 'ingress';
            }
            else if((item.direction).toLowerCase() == 'outbound') {
                data.direction = 'egress';
            }

            // Decide remote info
            if(item.remote_group_name == undefined) {
                data.remote_ip_prefix = item.remote_ip;
            }
            else if(item.remote_ip_prefix == undefined) {
                // Search remote group id by given remote group name
                
                // But if remote group name is equal, skip
                if(item.remote_group_name == securityGroup.name) {
                    data.remote_group_id = securityGroupId;
                }
                else {
                    // Search
                    var securityGroupViewed = await this.viewSecurityGroup_int(item.remote_group_name, tokenId);

                    // Failed
                    if(!securityGroupViewed.header.isSuccessful) {
                        fail_res.header.resultMessage = "Failed to create security group rule because of remote_group_name is invalid. Transaction start.";
                        fail_res.header.rawComputeMessage = securityGroupViewed.header.resultMessage;

                        // Transaction start. Delete security group
                        this.deleteSecurityGroup_int(securityGroupId, tokenId);
                        this.sendLog('Create security group request', 'network_log', request_uuid, fail_res);
                        return fail_res;
                    }
                    // Success (Viewed)
                    data.remote_group_id = securityGroupViewed.securityGroup.id;
                }
            }
            
            // Decide description
            if(item.description != '') {
                data.description = item.description;
            }

            // Create security group rule
            var securityGroupRuleData = await this.createSecurityGroupRule_int(data, tokenId);

            // Failed
            if(!securityGroupRuleData.header.isSuccessful) {
                fail_res.header.resultMessage = securityGroupRuleData.header.resultMessage + '. Transaction start.';
                if(securityGroupRuleData.header.errorDetail != undefined) {
                    fail_res.header.rawComputeMessage = securityGroupRuleData.header.errorDetail;
                }

                // Transaction start. Delete security group
                this.deleteSecurityGroup_int(securityGroupId, tokenId);
                this.sendLog('Create security group request', 'network_log', request_uuid, fail_res);
                return fail_res;
            }
        }
        
        // All job has successed

        final.header.isSuccessful = true;
        final.header.resultCode = 0;
        final.header.resultMessage = "SUCCESS";
        final.securityGroup = securityGroup;

        this.sendLog('Create security group request', 'network_log', request_uuid, final);
        return final;
    }

    async viewTotalSecurityGroups(request_uuid) {
        
        // Basic error response
        var fail_res = {
            'header': {
                'requestUUID': request_uuid,
                'isSuccessful':false,
                'resultCode':1,
                'resultMessage': ''
            }
        };

        // Final response data
        var final = {
            'header': {
                'requestUUID': request_uuid,
                'isSuccessful': '',
                'resultCode': '',
                'resultMessage': ''
            }
        };

        var tokenId = await Token.getTokenId();

        // Get security group list
        var securityGroupData = await this.viewSecurityGroupList_int(tokenId);
        if(!securityGroupData.header.isSuccessful) {
            fail_res.header.resultMessage = securityGroupData.header.resultMessage;
            if(securityGroupData.header.errorDetail != undefined) {
                fail_res.header.rawComputeMessage = securityGroupData.header.errorDetail;
            }

            this.sendLog('Total security group list view request', 'network_log', request_uuid, fail_res);
            return fail_res;
        }

        var securityGroupList = securityGroupData.securityGroups;
        
        // Rebuild response data
        var securityGroupList_rebuild = [];

        // Iterate via security groups and rebuild data

        // Security Group data cache
        var cachedRemoteGroupData = {};

        for(var index in securityGroupList) {
            var groupItem = securityGroupList[index];
            // Temporary data object
            var rebuild = {};
            var rules = [];

            rebuild.description = groupItem.description;
            rebuild.id = groupItem.id;
            rebuild.name = groupItem.name;
            
            // Iterate via security group's rule and rebuild data
            for(var index in groupItem.security_group_rules) {
                var ruleItem = groupItem.security_group_rules[index];
                // Temporary data object
                var rebuildRule = {};

                // Description
                rebuildRule.description = ruleItem.description;
                
                // Direction
                if(ruleItem.direction == 'ingress') {
                    rebuildRule.direction = 'inbound';
                } else if(ruleItem.direction == 'egress') {
                    rebuildRule.direction = 'outbound';
                } else {
                    rebuildRule.direction = 'ERROR';
                }

                // Ethertype, port range, protocol
                rebuildRule.ethertype = ruleItem.ethertype;
                rebuildRule.port_range_min = ruleItem.port_range_min;
                rebuildRule.port_range_max = ruleItem.port_range_max;
                rebuildRule.protocol = ruleItem.protocol;

                // Remote IP Address
                rebuildRule.remote_ip = ruleItem.remote_ip_prefix;

                // Remote Group Name
                if(ruleItem.remote_group_id == null) {
                    rebuildRule.remote_group_name = null;
                } else if (ruleItem.remote_group_id == ruleItem.security_group_id) {
                    rebuildRule.remote_group_name = groupItem.name;
                }
                else {
                    // Get remote group name from rule's remote group id
                    // Search data from cache first
                    if(cachedRemoteGroupData[ruleItem.remote_group_id] == undefined) {
                        // No hit
                        var remoteGroupData = await this.viewSecurityGroupById_int(ruleItem.remote_group_id, tokenId);
                        if(!remoteGroupData.header.isSuccessful) {
                            // Search failed
                            fail_res.header.resultMessage = "Get security groups request has failed because there was an error on security group [" + groupItem.name + ']';
                            fail_res.header.rawComputeMessage = fail_res.header.errorDetail;

                            this.sendLog('Total security group list view request', 'network_log', request_uuid, fail_res);
                            return fail_res;
                        }
                        // Search success
                        else {
                            var remoteGroupName = remoteGroupData.securityGroup.name;
                            // Store this data into cache
                            cachedRemoteGroupData[ruleItem.remote_group_id] = remoteGroupData.securityGroup.name;
                        }
                    }
                    // Cache hit
                    else {
                        var remoteGroupName = cachedRemoteGroupData[ruleItem.remote_group_id];
                    }

                    rebuildRule.remote_group_name = remoteGroupName;
                }

                // Stack
                rules.push(rebuildRule);
            }

            rebuild.securityGroupRules = rules;

            // Stack
            securityGroupList_rebuild.push(rebuild);
        }

        // Final response
        final.header.isSuccessful = true;
        final.header.resultCode = 0;
        final.header.resultMessage = "SUCCESS";
        final.header.securityGroups = securityGroupList_rebuild;

        this.sendLog('Total security group list view request', 'network_log', request_uuid, final);
        return final;
    }

    async viewSingleSecurityGroup(securityGroupName, request_uuid) {
        // Basic error response
        var fail_res = {
            'header': {
                'requestUUID': request_uuid,
                'isSuccessful':false,
                'resultCode':1,
                'resultMessage': ''
            }
        };

        // Final response data
        var final = {
            'header': {
                'requestUUID': request_uuid,
                'isSuccessful': '',
                'resultCode': '',
                'resultMessage': ''
            }
        };

        var tokenId = await Token.getTokenId();

        // Get security group data
        var securityGroupData = await this.viewSecurityGroup_int(securityGroupName, tokenId);
        if(!securityGroupData.header.isSuccessful) {
            // Failed to get data
            fail_res.header.resultMessage = securityGroupData.header.resultMessage;
            if(securityGroupData.header.errorDetail != undefined) {
                fail_res.header.rawComputeMessage = securityGroupData.header.errorDetail;
            }

            this.sendLog('Single security group view request', 'network_log', request_uuid, fail_res);
            return fail_res;
        }

       var securityGroup = securityGroupData.securityGroup;
       
       // Rebuild data
       var securityGroup_rebuild = {};
       var rules = [];

       // Security Group data cache
       var cachedRemoteGroupData = {};

       securityGroup_rebuild.description = securityGroup.description;
       securityGroup_rebuild.id = securityGroup.id;
       securityGroup_rebuild.name = securityGroup.name;

       // Iterate via security group rules and rebuild
       for(var index in securityGroup.security_group_rules) {
            var ruleItem = securityGroup.security_group_rules[index];

            // Temporary data object
            var rebuildRule = {};

            // Description
            rebuildRule.description = ruleItem.description;
            
            // Direction
            if(ruleItem.direction == 'ingress') {
                rebuildRule.direction = 'inbound';
            } else if(ruleItem.direction == 'egress') {
                rebuildRule.direction = 'outbound';
            } else {
                rebuildRule.direction = 'ERROR';
            }

            // Ethertype, port range, protocol
            rebuildRule.ethertype = ruleItem.ethertype;
            rebuildRule.port_range_min = ruleItem.port_range_min;
            rebuildRule.port_range_max = ruleItem.port_range_max;
            rebuildRule.protocol = ruleItem.protocol;

            // Remote IP Address
            rebuildRule.remote_ip = ruleItem.remote_ip_prefix;

            // Remote Group Name
            if(ruleItem.remote_group_id == null) {
                rebuildRule.remote_group_name = null;
            } else if (ruleItem.remote_group_id == ruleItem.security_group_id) {
                rebuildRule.remote_group_name = securityGroup.name;
            }
            else {
                // Get remote group name from rule's remote group id
                // Search data from cache first
                if(cachedRemoteGroupData[ruleItem.remote_group_id] == undefined) {
                    // No hit
                    var remoteGroupData = await this.viewSecurityGroupById_int(ruleItem.remote_group_id, tokenId);
                    if(!remoteGroupData.header.isSuccessful) {
                        // Search failed
                        fail_res.header.resultMessage = "Get security groups request has failed because there was an error on security group [" + securityGroup.name + ']';
                        fail_res.header.rawComputeMessage = fail_res.header.errorDetail;

                        this.sendLog('Single security group view request', 'network_log', request_uuid, fail_res);
                        return fail_res;
                    }
                    // Search success
                    else {
                        var remoteGroupName = remoteGroupData.securityGroup.name;
                        // Store this data into cache
                        cachedRemoteGroupData[ruleItem.remote_group_id] = remoteGroupData.securityGroup.name;
                    }
                }
                // Cache hit
                else {
                    var remoteGroupName = cachedRemoteGroupData[ruleItem.remote_group_id];
                }

                rebuildRule.remote_group_name = remoteGroupName;
            }

            // Stack
            rules.push(rebuildRule);
       }

       securityGroup_rebuild.securityGroupRules = rules;

       // Final response
       final.header.isSuccessful = true;
       final.header.resultCode = 0;
       final.header.resultMessage = "SUCCESS";
       final.header.securityGroups = securityGroup_rebuild;

       this.sendLog('Single security group view request', 'network_log', request_uuid, final);
       return final;
        
    }

    async viewSingleSecurityGroupDetail(securityGroupName, request_uuid) {
        // Basic error response
        var fail_res = {
            'header': {
                'requestUUID': request_uuid,
                'isSuccessful':false,
                'resultCode':1,
                'resultMessage': ''
            }
        };

        // Final response data
        var final = {
            'header': {
                'requestUUID': request_uuid,
                'isSuccessful': '',
                'resultCode': '',
                'resultMessage': ''
            }
        };

        var tokenId = await Token.getTokenId();

        // Get requested security group data
        var securityGroupData = await this.viewSecurityGroup_int(securityGroupName, tokenId);
        if(!securityGroupData.header.isSuccessful) {
            fail_res.header.resultMessage = "Failed to get requested security group data";
            if(securityGroupData.header.errorDetail != undefined) {
                fail_res.header.rawComputeMessage = securityGroupData.header.errorDetail;
            }

            this.sendLog('Single security group detail view request', 'network_log', request_uuid, fail_res);
            return fail_res;
        }

        var securityGroup = securityGroupData.securityGroup;

        // Security Group data cache
        var cachedRemoteGroupData = {};

        // Iterate via security group rule and add remote group name
        for(var index in securityGroup.security_group_rules) {
            var ruleItem = securityGroup.security_group_rules[index];

            // replace direction
            if(ruleItem.direction == 'ingress') {
                ruleItem.direction = 'inbound';
            } else if(ruleItem.direction == 'egress') {
                ruleItem.direction = 'outbound';
            } else {
                ruleItem.direction = 'ERROR';
            }

            // Get remote group name
            if(ruleItem.remote_group_id == null) {
                ruleItem.remote_group_name = null;
            }
            else {
                if(ruleItem.remote_group_id == ruleItem.security_group_id) {
                    ruleItem.remote_group_name = securityGroup.name;
                } else {
                    // Search remote group id in cache first
                    if(cachedRemoteGroupData[ruleItem.remote_group_id] == undefined) {
                        // No hit
                        var remoteGroupData = await this.viewSecurityGroupById_int(ruleItem.remote_group_id, tokenId);
                        if(!remoteGroupData.header.isSuccessful) {
                            // Search failed
                            fail_res.header.resultMessage = "Get detail security group data request has failed because there was an error on security group [" + securityGroup.name + ']';
                            fail_res.header.rawComputeMessage = fail_res.header.errorDetail;

                            this.sendLog('Single security group detail view request', 'network_log', request_uuid, fail_res);
                            return fail_res;
                        }
                        // Search success
                        else {
                            var remoteGroupName = remoteGroupData.securityGroup.name;
                            // Store this data into cache
                            cachedRemoteGroupData[ruleItem.remote_group_id] = remoteGroupData.securityGroup.name;
                        }
                    }
                    // Cache hit
                    else {
                        var remoteGroupName = cachedRemoteGroupData[ruleItem.remote_group_id];
                    }

                    ruleItem.remote_group_name = remoteGroupName;
                }
            }
        }

        // Get linked instance list


        var linkedServerData = await this.getSecurityGroupLinkedServers_int(securityGroup.name, tokenId);
        if(!linkedServerData.header.isSuccessful) {
            fail_res.header.resultMessage = "Failed to get requested security group because error occured on getting instance data";
            if(linkedServerData.header.errorDetail != undefined) {
                fail_res.header.rawComputeMessage = linkedServerData.header.errorDetail;
            }

            this.sendLog('Single security group detail view request', 'network_log', request_uuid, fail_res);
            return fail_res;
        }
        else {
            securityGroup.linkedServers = linkedServerData.linkedServers;
        }
        
        // final response
        final.header.isSuccessful = true;
        final.header.resultCode = 0;
        final.header.resultMessage = "SUCCESS";
        final.securityGroup = securityGroup;

        this.sendLog('Single security group detail view request', 'network_log', request_uuid, final);
        return final;
    }

    async deleteSecurityGroup(securityGroups, isForce, request_uuid) {
        // Basic error response
        var fail_res = {
            'header': {
                'requestUUID': request_uuid,
                'isSuccessful':false,
                'resultCode':1,
                'resultMessage': ''
            }
        };

        // Final response data
        var final = {
            'header': {
                'requestUUID': request_uuid,
                'isSuccessful': '',
                'resultCode': '',
                'resultMessage': ''
            }
        };

        var tokenId = await Token.getTokenId();
        var response = [];
        var failCount = 0;

        // Iterate via given security groups
        for(var index in securityGroups) {

            // Individual job response
            var responseData = {
                'header': {
                    'isSuccessful': '',
                    'resultCode': '',
                    'resultMessage': ''
                },
                'body': {
                    'targetSecurityGroup': {
                        'name': '',
                        'status': ''
                    }
                }
            };
            
            var group = securityGroups[index];
            var securityGroupName = group.name;

            // Get security group information
            var securityGroupData = await this.viewSecurityGroup_int(securityGroupName, tokenId);
            if(!securityGroupData.header.isSuccessful) {
                // Failed to get security group data. Abort this job
                responseData.header.isSuccessful = false;
                responseData.header.resultCode = -1;
                responseData.header.resultMessage = "Failed to delete securtiy group. Aquring requested security gorup data has failed";
                responseData.header.rawComputeMessage = securityGroupData.errorDetail;

                responseData.body.targetSecurityGroup.name = securityGroupName;
                responseData.body.targetSecurityGroup.status = "UNKNOWN";

                // Stack to response
                response.push(responseData);

                // Increment fail count
                failCount = failCount + 1;
                
                // Next job
                continue;
            }
            var securityGroupId = securityGroupData.securityGroup.id;

            // If force option is enabled
            if(isForce) {
                // Get linked servers
                var linkedServerData = await this.getSecurityGroupLinkedServers_int(securityGroupName, tokenId);
                if(!linkedServerData.header.isSuccessful) {
                    responseData.header.isSuccessful = false;
                    responseData.header.resultCode = 1;
                    responseData.header.resultMessage = "Failed to delete security group because aquiring linked server data has failed";
                    responseData.rawComputeMessage = linkedServerData.header.errorDetail;

                    responseData.body.targetSecurityGroup.name = securityGroupName;
                    responseData.body.targetSecurityGroup.status = "ONLINE";

                    // Stack to response
                    response.push(responseData);

                    // Increment fail count
                    failCount = failCount + 1;
                    
                    // Next job
                    continue;
                }

                var linkedServers = linkedServerData.linkedServers;
                var isDetachFailed = false;

                // Iterate via linked servers and detach security group
                for(var index in linkedServers) {
                    var server = linkedServers[index];
                    var serverId = server.id;

                    var detachResult = await this.detachSecurityGroupFromInstance_int(serverId, securityGroupName, tokenId);
                    if(!detachResult.header.isSuccessful) {
                        // Detach failed. Abort this job.
                        responseData.header.isSuccessful = false;
                        responseData.header.resultCode = 2;
                        responseData.header.resultMessage = "Failed to delete security group because detaching failed on instance [" + server.name + ']';
                        responseData.header.rawComputeMessage = detachResult.header.errorDetail;

                        responseData.body.targetSecurityGroup.name = securityGroupName;
                        responseData.body.targetSecurityGroup.status = "ONLINE";

                        // Stack to response
                        response.push(responseData);

                        // Enable fail flag
                        isDetachFailed = true;

                        // Increment fail count
                        failCount = failCount + 1;

                        // Abort iteration
                        break;
                    }
                }
                if(isDetachFailed) {
                    //Abort this job
                    continue;
                }
            }

            // Delete security group
            var deleteResult = await this.deleteSecurityGroup_int(securityGroupId, tokenId);
            if(!deleteResult.header.isSuccessful) {
                // Delete failed. Abort this job.
                responseData.header.isSuccessful = false;
                responseData.header.resultCode = 3;
                responseData.header.resultMessage = "Failed to delete security group."
                responseData.header.rawComputeMessage = deleteResult.header.errorDetail;

                responseData.body.targetSecurityGroup.name = securityGroupName;
                
                if(isForce) {
                    responseData.body.targetSecurityGroup.status = "DETACHED";
                } else {
                    responseData.body.targetSecurityGroup.status = "ONLINE";
                }

                // Stack to response
                response.push(responseData);

                // Increment fail count
                failCount = failCount + 1;
            }
            // Delete success
            else {
                responseData.header.isSuccessful = true;
                responseData.header.resultCode = 0;
                responseData.header.resultMessage = "SUCCESS";

                responseData.body.targetSecurityGroup.name = securityGroupName;
                responseData.body.targetSecurityGroup.status = "DELETED";

                //Stack to response
                response.push(responseData);
            }

        }

        // Final response
        if(failCount == 0) {
            final.header.isSuccessful = true;
            final.header.resultCode = 0;
            final.header.resultMessage = "SUCCESS";
        } else if(failCount > 0 && failCount < securityGroups.length) {
            final.header.isSuccessful = false;
            final.header.resultCode = 1;
            final.header.resultMessage = "PARTIAL SUCCESS";
        } else if(failCount == securityGroups.length) {
            final.header.isSuccessful = false;
            final.header.resultCode = 2;
            final.header.resultMessage = "FAILED";
        }

        final.securityGroups = response;

        this.sendLog('Security group delete request', 'network_log', request_uuid, final);
        
        return final;
    }

    async detachSecurityGroupFromInstance_int(instanceId, securityGroupName, tokenId) {
        var url = COMPUTE_BASE_URL + apiVersion + '/' + Toast.tenantId + '/servers/' + instanceId + '/action';
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Auth-Token': tokenId
        };

        var data = {
            'removeSecurityGroup': {
                'name': securityGroupName
            }
        };

        // Final response data
        var final = {
            'header': {
                'requestUUID': 'internal',
                'isSuccessful': '',
                'resultCode': '',
                'resultMessage': ''
            }
        };

        // Detach
        var res = await apiAdapter.POST(url, headers, data);
        
        // API call failed
        if(typeof res != 'string' && typeof res.response != undefined) {
            res = res.response.data;

            final.header.isSuccessful = false;
            final.header.resultCode = 1;
            final.header.resultMessage = "Failed to detach security group from instance";
            final.header.errorDetail = res;
        }
        // API call success
        else {
            final.header.isSuccessful = true;
            final.header.resultCode = 0;
            final.header.resultMessage = "SUCCESS";
        }

        this.sendLog("Detach security group from instance request", "internal_compute_log", "internal", final);
    
        return final;
    }

    async getSecurityGroupLinkedServers_int(securityGroupName, tokenId) {
         
        // Final response data
        var final = {
            'header': {
                'requestUUID': 'internal',
                'isSuccessful': '',
                'resultCode': '',
                'resultMessage': ''
            }
        };

        // Get total instance detail list
        var serverData = await this.viewTotalInstanceDetail_int(tokenId);
        if(!serverData.header.isSuccessful) {
            final.header.resultMessage = "Failed to get server detail list";
            if(serverData.header.errorDetail != undefined) {
                final.header.errorDetail = serverData.header.errorDetail;
            }
        } 
        else {
            var servers = serverData.servers;

            // Filter server with security group
            var serversFiltered = servers.filter(function(server) {
                var serverSecurityGroup = server.security_groups;
                
                // Iterate via server's security groups
                for(var index in serverSecurityGroup) {
                    var item = serverSecurityGroup[index];

                    if(item.name == securityGroupName) {
                        return true;
                    }
                }

                return false;
            })

            // Subset filtered server data
            var serversFilteredPicked = [];
            
            for(var index in serversFiltered) {
                var item = serversFiltered[index];
                var picked = (({id, name}) => ({id, name}))(item);

                // Stack
                serversFilteredPicked.push(picked);
            }
        }

        final.header.isSuccessful = true;
        final.header.resultCode = 0;
        final.header.resultMessage = "SUCCESS";
        final.linkedServers = serversFilteredPicked;


        this.sendLog("Security group linked server view request", "internal_network_log", "internal", final);
    
        return final;
    }

    async createSecurityGroup_int(securityGroup, tokenId) {
        var url = NETWORK_BASE_URL + network_apiVersion + '/security-groups';
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Auth-Token': tokenId
        };

        // Final response data
        var final = {
            'header': {
                'requestUUID': 'internal',
                'isSuccessful': '',
                'resultCode': '',
                'resultMessage': ''
            }
        };

        var securityGroupName = securityGroup.name;
        if(securityGroup.description != undefined) {
            var securityGroupDesc = securityGroup.description;
        }

        // Basic validation
        if(securityGroupName == "" || securityGroupName == null || securityGroupName == undefined || typeof securityGroupName != "string") {
            final.header.isSuccessful = false;
            final.header.resultCode = -1;
            final.header.resultMessage = "Requesting security group name is invalid";

            this.sendLog("Security group create request", "internal_network_log", "internal", final);
    
            return final;
        }

        // Generate data
        var data = {
            'security_group': {
                'name': securityGroupName
            }
        };
        if(securityGroupDesc != undefined) {
            data.security_group.description = securityGroupDesc;
        }

        // API call
        var res = await apiAdapter.POST(url, headers, data);

        // API call failed
        if(res.security_group == undefined) {
            res = res.response.data;
            
            final.header.isSuccessful = false;
            final.header.resultCode = 1;
            final.header.resultMessage = "Failed to create Security group";
            final.header.errorDetail = res;

            this.sendLog("Security group create request", "internal_network_log", "internal", final);
    
            return final;
        }
        
        // Delete default security policy
        var defaultSecurityGroupRules = res.security_group.security_group_rules;

        // Iterate and delete
        for(var index in defaultSecurityGroupRules) {
            var item = defaultSecurityGroupRules[index];
            var securityGroupRuleId = item.id;

            var result = await this.deleteSecurityGroupRule_int(securityGroupRuleId, tokenId);
            if(!result.header.isSuccessful) {
                final.header.isSuccessful = false;
                final.header.resultCode = 1;
                final.header.resultMessage = "Failed to create Security group." + result.header.resultMessage +"Transaction start";
                final.header.errorDetail = result.header.errorDetail;

                // Transaction start. Delete security group
                this.deleteSecurityGroup_int(res.security_group.id, tokenId);

                this.sendLog("Security group create request", "internal_network_log", "internal", final);
    
                return final;
            }
        }

        var securityGroup = (({name, id, description }) => ({name, id, description}))(res.security_group);
        final.header.isSuccessful = true;
        final.header.resultCode = 0;
        final.header.resultMessage = "SUCCESS";
        final.securityGroup = securityGroup;
                
        // Send log
        this.sendLog("Security group create request", "internal_network_log", "internal", final);
    
        return final; 
        
    }

    async deleteSecurityGroup_int(securityGroupId, tokenId) {
        var url = NETWORK_BASE_URL + network_apiVersion + '/security-groups/' + securityGroupId;
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Auth-Token': tokenId
        };

        // Final response data
        var final = {
            'header': {
                'requestUUID': 'internal',
                'isSuccessful': '',
                'resultCode': '',
                'resultMessage': ''
            }
        };

        // API call
        var res = await apiAdapter.DELETE(url, headers);

        // API call failed
        if(typeof res != 'string' && typeof res.response != undefined) {
            res = res.response.data;

            final.header.isSuccessful = false;
            final.header.resultCode = 1;
            final.header.resultMessage = "Failed to delete security group";
            final.header.errorDetail = res;
        }
        // API call success
        else {
            final.header.isSuccessful = true;
            final.header.resultCode = 0;
            final.header.resultMessage = "SUCCESS";
        }

        // Send log
        this.sendLog("Delete security group request", "internal_network_log", "internal", final);
    
        return final; 
    }

    async deleteSecurityGroupRule_int(securityGroupRuleId, tokenId) {
        var url = NETWORK_BASE_URL + network_apiVersion + '/security-group-rules/' + securityGroupRuleId;
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Auth-Token': tokenId
        };

        // Final response data
        var final = {
            'header': {
                'requestUUID': 'internal',
                'isSuccessful': '',
                'resultCode': '',
                'resultMessage': ''
            }
        };
        
        // API call
        var res = await apiAdapter.DELETE(url, headers);

        // API call failed
        if(typeof res != 'string' && typeof res.response != undefined) {
            res = res.response.data;

            final.header.isSuccessful = false;
            final.header.resultCode = 1;
            final.header.resultMessage = "Failed to delete security group rule";
            final.header.errorDetail = res;
        }
        // API call success
        else {
            final.header.isSuccessful = true;
            final.header.resultCode = 0;
            final.header.resultMessage = "SUCCESS";
        }
        
        // Send log
        this.sendLog("Delete security group rule request", "internal_network_log", "internal", final);
    
        return final; 
    }

    async createSecurityGroupRule_int(securityGroupRule, tokenId) {
        var url = NETWORK_BASE_URL + network_apiVersion + '/security-group-rules';
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Auth-Token': tokenId
        };

        // Final response data
        var final = {
            'header': {
                'requestUUID': 'internal',
                'isSuccessful': '',
                'resultCode': '',
                'resultMessage': ''
            }
        };

        // Generate request data
        var data = {
            'security_group_rule': securityGroupRule
        };

        // API call
        var res = await apiAdapter.POST(url, headers, data);

        // API call failed
        if(res.security_group_rule == undefined) {
            res = res.response.data;
            final.header.isSuccessful = false;
            final.header.resultCode = 1;
            final.header.resultMessage = "Failed to create security group rule";
            final.header.errorDetail = res;
        }
        // API call success
        else {
            final.header.isSuccessful = true;
            final.header.resultCode = 0;
            final.header.resultMessage = "SUCCESS";
            final.securityGroupRule = res.security_group_rule;
        }

        // Send log
        this.sendLog("Security group rule create request", "internal_network_log", "internal", final);
    
        return final; 
    }

    async viewSecurityGroup_int(securityGroupName, tokenId) {
        var url = NETWORK_BASE_URL + network_apiVersion + '/security-groups?name=' + securityGroupName; 
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Auth-Token': tokenId
        };

        // Final response data
        var final = {
            'header': {
                'requestUUID': 'internal',
                'isSuccessful': '',
                'resultCode': '',
                'resultMessage': ''
            }
        };

        // Basic validation
        if(securityGroupName == "" || securityGroupName == null || securityGroupName == undefined || typeof securityGroupName != "string") {
            final.header.isSuccessful = false;
            final.header.resultCode = -1;
            final.header.resultMessage = "Requested security group is invalid";

            this.sendLog("Security group view request", "internal_network_log", "internal", final);
    
            return final;
        }

        // API call
        var res = await apiAdapter.GET(url, headers);

        // API call failed
        if(res.security_groups == undefined) {
            res = res.response.data;
            if(res.error.code == 401) {
                // Token information is wrong
                final.header.isSuccessful = false;
                final.header.resultCode = 1;
                final.header.resultMessage = "Token authentication failed";
                final.header.errorDetail = res.error.message;
            } else {
                final.header.isSuccessful = false;
                final.header.resultCode = 1;
                final.header.resultMessage = "UNKNOWN ERROR";
                final.header.errorDetail = res.error.message;
            }
        }
        // API call success 
        else {
            // But there is no data with a given security group name
            if(res.security_groups.length == 0) {
                final.header.isSuccessful = false;
                final.header.resultCode = 2;
                final.header.resultMessage = "Cannot find requesting security group [" + securityGroupName + ']';
            } 
            // Successed and found data
            else {
                final.header.isSuccessful = true;
                final.header.resultCode = 0;
                final.header.resultMessage = "SUCCESS";
                final.securityGroup = res.security_groups[0];
            }
        }

        // Send log
        this.sendLog("Security group view request", "internal_network_log", "internal", final);
    
        return final; 
    }

    async viewSecurityGroupById_int(securityGroupId, tokenId) {
        var url = NETWORK_BASE_URL + network_apiVersion + '/security-groups/' + securityGroupId;
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Auth-Token': tokenId
        };

        // Final response data
        var final = {
            'header': {
                'requestUUID': 'internal',
                'isSuccessful': '',
                'resultCode': '',
                'resultMessage': ''
            }
        };

        // API call
        var res = await apiAdapter.GET(url, headers);

        // API call failed
        if(res.security_group == undefined) {
            res = res.response.data;
            final.header.isSuccessful = false;
            final.header.resultCode = 1;
            final.header.resultMessage = "Caanot find requesting security group";
            final.header.errorDetail = res;
        }
        //API call success
        else {
            final.header.isSuccessful = true;
            final.header.resultCode = 0;
            final.header.resultMessage = "SUCCESS";
            final.securityGroup = res.security_group;
        }

        // Send log
        this.sendLog("Security group view by ID request", "internal_network_log", "internal", final);
    
        return final; 
    }

    async viewSecurityGroupList_int(tokenId) {
        var url = NETWORK_BASE_URL + network_apiVersion + '/security-groups';
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Auth-Token': tokenId
        };

        // Final response data
        var final = {
            'header': {
                'requestUUID': 'internal',
                'isSuccessful': '',
                'resultCode': '',
                'resultMessage': ''
            }
        };

        // API call
        var res = await apiAdapter.GET(url, headers);

        // API call failed
        if(res.security_groups == undefined) {
            res = res.response.data;
            final.header.isSuccessful = false;
            final.header.resultCode = 1;
            final.header.resultMessage = "Aquiring security groups failed";
            final.header.errorDetail = res;
        }
        // API call success
        else {
            final.header.isSuccessful = true;
            final.header.resultCode = 0;
            final.header.resultMessage = "SUCCESS";
            final.securityGroups = res.security_groups;
        }

        // Send log
        this.sendLog("Security group list view request", "internal_network_log", "internal", final);
    
        return final; 
    }

    async getTokenIdManual(tenantId, apiCredential) {

        // Get API credential
        var username = apiCredential.id;
        var password = apiCredential.apiPassword;
        
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
    
        if(res.access == undefined) {
            // Fail Exception
            var res = res.response.data;
            if(res.error.code == 500) {
                final.header.isSuccessful = false;
                final.header.resultCode = 1;
                final.header.resultMessage = res.error.message;
            } else if(res.error.code == 401) {
                final.header.isSuccessful = false;
                final.header.resultCode = -1;
                final.header.resultMessage = res.error.message;
            } else {
                final.header.isSuccessful = false;
                final.header.resultCode = 1;
                final.header.resultMessage = "UNKNOWN ERROR";
            }
        } else {
            // Success response
            final.header.isSuccessful = true;
            final.header.resultCode = 0;
            final.header.resultMessage = "SUCCESS";
            var tokenData = res.access.token;
            final.token = tokenData;
        }
    
        // Send log
        this.sendLog("Target tenant token request", "internal_compute_log", "internal", final);
    
        return final;
    }

    async viewInstanceFromName_int(instanceName) {
        var tokenId = await Token.getTokenId();
        var url = COMPUTE_BASE_URL + apiVersion + '/' + Toast.tenantId + '/servers/detail?name=' + instanceName + '$';
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Auth-Token': tokenId
        };

        var res = await apiAdapter.GET(url, headers);
        var instanceData = res.servers[0];

        var final = {
            'header': {
                'requestUUID': 'internal',
                'isSuccessful': '',
                'resultCode': '',
                'resultMessage': ''
            }
        };

        if(instanceData == undefined || instanceData == null) {
            // If instance data is null
            final.header.isSuccessful = false;
            final.header.resultCode = 1;
            final.header.resultMessage = 'Cannot find requesting instance' + ' [' + instanceName + ']';
        } else if (res.servers.length >= 2) {
            // 동일한 hostname으로 인해 instance data가 두 개 이상 반환될 경우
            final.header.isSuccessful = false;
            final.header.resultCode = 1;
            final.header.resultMessage = 'There is more than two instances that has same requested hostname. Please try again with UUID';
        } else if (instanceData.name != instanceName) {
            // 요청한 instance name과 결과값으로 나온 instance name이 일치하지 않을 경우
            final.header.isSuccessful = false;
            final.header.resultCode = 1;
            final.header.resultMessage = 'Cannot find requesting instance' + ' [' + instanceName + ']';
        } else {
            // 성공했을 경우
            final.header.isSuccessful = true;
            final.header.resultCode = 0;
            final.header.resultMessage = 'SUCCESS';
            final.server = instanceData;
        }

        this.sendLog("Instance data [from name] viewed", "internal_compute_log", "internal", final);

        return final;
    }

    async viewPort_int(instanceId) {
        var tokenId = await Token.getTokenId();
        var url = NETWORK_BASE_URL + network_apiVersion + '/ports' + '?device_id=' + instanceId; 
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Auth-Token': tokenId
        };

        var res = await apiAdapter.GET(url, headers);
        var portData = res.ports;
        
        var final = {
            'header': {
                'requestUUID': 'internal',
                'isSuccessful': true,
                'resultCode': 0,
                'resultMessage': 'SUCCESS'
            },
            'ports': portData
        };

        this.sendLog("Port list viewed", "internal_compute_log", "internal", final);

        return final;
    }

    async viewFIP_int(fipAddress) {
        var tokenId = await Token.getTokenId();
        var url = NETWORK_BASE_URL + network_apiVersion + '/floatingips?floating_ip_address=' + fipAddress;
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Auth-Token': tokenId
        };

        var res = await apiAdapter.GET(url, headers);
        var floatingIpData = res.floatingips;

        var final = {
            'header': {
                'requestUUID': 'internal',
                'isSuccessful': '',
                'resultCode': '',
                'resultMessage': ''
            }
        };

        if(floatingIpData.length == 0) {
            // If no fip has found
            final.header.isSuccessful = false;
            final.header.resultCode = 1;
            final.header.resultMessage = 'FIP not found';
        } else {
            final.header.isSuccessful = true;
            final.header.resultCode = 0;
            final.header.resultMessage = 'SUCCESS';
            final.floatingIp = floatingIpData[0];
        }

        this.sendLog("FIP list viewed", "internal_compute_log", "internal", final);

        return final;
    }

    async createFIP_int() {
        var tokenId = await Token.getTokenId();
        var url = NETWORK_BASE_URL + network_apiVersion + '/floatingips';
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Auth-Token': tokenId
        };

        // Get public network id
        var publicNetwork = toastDB.get('networks')
                        .find({name: 'Public Network'}).value();

        var data = {
            'floatingip': {
                'floating_network_id': publicNetwork.id
            }
        };

        var res = await apiAdapter.POST(url, headers, data);

        var final = {
            'header': {
                'requestUUID': 'internal',
                'isSuccessful': '',
                'resultCode': '',
                'resultMessage': ''
            }
        };

        if(res.floatingip == undefined) {
            // If creating fip failed
            final.header.isSuccessful = false;
            final.header.resultCode = 1;
            if(res.response.data.NeutronError != undefined) {
                final.header.resultMessage = res.response.data.NeutronError.message;
            } else {
                final.header.resultMessage = 'Failed to create floating IP';
            }
        } else {
            final.header.isSuccessful = true;
            final.header.resultCode = 0;
            final.header.resultMessage = 'SUCCESS';
            final.floatingIp = res.floatingip;
        }

        this.sendLog("FIP create request", "internal_compute_log", "internal", final);

        return final;
    }

    async viewTotalInstanceDetail_int(tokenId) {
        var url = COMPUTE_BASE_URL + apiVersion + '/' + Toast.tenantId + '/servers/detail?limit=1000';
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Auth-Token': tokenId
        };

        // Final response data
        var final = {
            'header': {
                'requestUUID': 'internal',
                'isSuccessful': '',
                'resultCode': '',
                'resultMessage': ''
            }
        };

        // API Call
        var res = await apiAdapter.GET(url, headers);

        // API call failed
        if(res.servers == undefined) {
            res = res.response.data;
            final.header.isSuccessful = false;
            final.header.resultCode = 1;
            final.header.resultMessage = "Failed to get instance detail data";
            final.header.rawComputeMessage = res;
        }
        // API call success
        else {
            // But there is no data
            if(res.servers.length == 0) {
                final.header.isSuccessful = false;
                final.header.resultCode = 2;
                final.header.resultMessage = "There is no instance on tenant";
            }else {
                final.header.isSuccessful = true;
                final.header.resultCode = 0;
                final.header.resultMessage = "SUCCESS";
                final.servers = res.servers;
            }
        }

        // Send log
        this.sendLog("Total instance detail view request", "internal_compute_log", "internal", final);

        return final;
    }

    async viewFlavor_int() {
        var tokenId = await Token.getTokenId();
        var url = COMPUTE_BASE_URL + apiVersion + '/' + Toast.tenantId + '/flavors';
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Auth-Token': tokenId
        };
                
        var res = await apiAdapter.GET(url, headers);
        var flavorData = res.flavors;
        
        toastDB.set('flavors', flavorData)
               .write();

        var final = {
            'header': {
                'requestUUID': 'internal',
                'isSuccessful': true,
                'resultCode': 0,
                'resultMessage': 'SUCCESS'
            },
            'flavors': flavorData
        }

        this.sendLog("Flavor list viewed", "internal_compute_log", 'internal', final);
    }

    async viewImage_int() {
        var tokenId = await Token.getTokenId();
        var url = IMAGE_BASE_URL + apiVersion + '/images' + '?limit=1000';
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Auth-Token': tokenId
        };

        var res = await apiAdapter.GET(url, headers);
        var imageData = res.images;
        
        toastDB.set('images', imageData)
               .write();

        var final = {
            'header': {
                'requestUUID': 'internal',
                'isSuccessful': true,
                'resultCode': 0,
                'resultMessage': 'SUCCESS'
            },
            'images': imageData
        }

        this.sendLog("Image list viewed", "internal_compute_log", 'internal', final);
    }

    async viewVPC_int() {
        var tokenId = await Token.getTokenId();
        var url = NETWORK_BASE_URL + network_apiVersion + '/networks';
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Auth-Token': tokenId
        };

        var res = await apiAdapter.GET(url, headers);
        var vpcData = res.networks;

        toastDB.set('networks', vpcData)
               .write();

        var final = {
            'header': {
                'requestUUID': 'internal',
                'isSuccessful': true,
                'resultCode': 0,
                'resultMessage': 'SUCCESS'
            },
            'networks': vpcData
        }

        this.sendLog("VPC list viewed", "internal_compute_log", 'internal', final);
    }

    async viewSubnet_int() {
        var tokenId = await Token.getTokenId();
        var url = NETWORK_BASE_URL + network_apiVersion + '/subnets';
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Auth-Token': tokenId
        };

        var res = await apiAdapter.GET(url, headers);
        var subnetData = res.subnets;

        toastDB.set('subnets', subnetData)
               .write();

        var final = {
            'header': {
                'requestUUID': 'internal',
                'isSuccessful': true,
                'resultCode': 0,
                'resultMessage': 'SUCCESS'
            },
            'subnets': subnetData
        }

        this.sendLog("Subnet list viewed", "internal_compute_log", 'internal', final);
    }

    async sendLog(logMessage, logType, request_uuid, response) {
        var url = 'https://api-logncrash.cloud.toast.com/v2/log';
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8'
        };

        var isSuccessful = response.header.isSuccessful;

        var data = {
            'projectName': Toast.logAppkey,
            'projectVersion': 'test',
            'logVersion': 'v2',
            'body': logMessage,
            'logType': logType,
            'orgInfo': Toast.orgName,
            'requestUUID': request_uuid,
            'apiResponse': response,
            'isSuccessful': isSuccessful
        }

        // Send Log to TOAST Log & Crash Search
        var result = await apiAdapter.POST(url, headers, data);
        // Send Log to Dooray incomming hook except internal api call
        if(response.header.requestUUID != 'internal') {
            doorayHook.sendHook(logMessage, response);
        }
        
        // Send Dooray hook if logging has failed
        if(!result.header || result.header.isSuccessful == false) {
            doorayHook.sendHook("Logging failed", response);
        }
        
        return result;
    }

    async sendRequestLog(logMessage, logType, customData) {
        var url = 'https://api-logncrash.cloud.toast.com/v2/log';
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8'
        };

        var request_path = customData.request_path;
        var request_uuid = customData.request_uuid;
        var request_origin_ip = customData.request_origin_ip;
        var request_raw_data = customData.request_raw_data;

        var data = {
            'projectName': Toast.logAppkey,
            'projectVersion': 'test',
            'logVersion': 'v2',
            'body': logMessage,
            'logType': logType,
            'orgInfo': Toast.orgName,
            'requestPath': request_path,
            'requestUUID': request_uuid,
            'requestOriginIP': request_origin_ip,
            'requestRawData': request_raw_data
        }

        var result = await apiAdapter.POST(url, headers, data);

        return result;
    }

    async viewInstance(instance_info, request_uuid) {

        // Basic error response
        var fail_res = {
            'header': {
                'requestUUID': request_uuid,
                'isSuccessful':false,
                'resultCode':1,
                'resultMessage': ''
            }
        }

        var tokenId = await Token.getTokenId();
        
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Auth-Token': tokenId
        };

        // API endpoint
        var url = '';

        // View instance list
        if(instance_info == null) {
            url = COMPUTE_BASE_URL + apiVersion + '/' + Toast.tenantId + '/servers';
        }
        // View instance by host name
        else if(instance_info.length < 36) {
            url = COMPUTE_BASE_URL + apiVersion + '/' + Toast.tenantId + '/servers?name=' + instance_info + '$';
        }
        // View instance by uuid
        else if(instance_info.length == 36) {
            url = COMPUTE_BASE_URL + apiVersion + '/' + Toast.tenantId + '/servers/' + instance_info;
        }
        else {
            fail_res.header.resultMessage = 'Given insatnce information is invalid'
            this.sendLog('View instance request', 'instance_log', request_uuid, fail_res);
            return fail_res;
        }

        var res = await apiAdapter.GET(url, headers);
 
        var final = {
            'header': {
                'requestUUID': request_uuid,
                'isSuccessful': true,
                'resultCode': 0,
                'resultMessage': "SUCCESS"
            },
            'data': res
        };

        this.sendLog("Instance data viewed", "instance_log", request_uuid, final);

        return final;
    }

    async viewTotalInstance(request_uuid) {
        // Basic error response
        var fail_res = {
            'header': {
                'requestUUID': request_uuid,
                'isSuccessful':false,
                'resultCode':1,
                'resultMessage': ''
            }
        }

        var tokenId = await Token.getTokenId();
        var url = COMPUTE_BASE_URL + apiVersion + '/' + Toast.tenantId + '/servers';
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Auth-Token': tokenId
        };

        var res = await apiAdapter.GET(url, headers);

        var final = {
            'header': {
                'requestUUID': request_uuid,
                'isSuccessful': true,
                'resultCode': 0,
                'resultMessage': "SUCCESS"
            },
            'data': res
        };

        this.sendLog("Instance Total data viewed", "instance_log", request_uuid, final);

        return final;

    }

    async testing() {
       var res = {
           'message': 'test'
       };

       return res;
    }
}
*/

module.exports = {
    getToken,
    getOsVolumeAttachments,
    getInstanceList,
    getVolume
}