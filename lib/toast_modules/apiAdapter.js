var axios = require('axios');

async function POST(req_url, headers, data) {
    let result =  await axios({
        method: 'post',
        url: req_url,
        headers,
        data
      })
      .then(response => {
        body = response.data;
        return body;
      })
      .catch(error => {
        return error
      })

      return result;
}

async function GET(req_url, headers) {
    let result = await axios({
        method: 'get',
        url: req_url,
        headers
      })
      .then(response => {
        body = response.data;
        return body;
      })
      .catch(error => {
        return error
      })

      return result;
}

async function DELETE(req_url, headers) {
  let result = await axios({
      method: 'delete',
      url: req_url,
      headers
    })
    .then(response => {
      body = response.data;
      return body;
    })
    .catch(error => {
      return error
    })

    return result;
}

async function PUT(req_url, headers, data) {
  let result =  await axios({
      method: 'put',
      url: req_url,
      headers,
      data
    })
    .then(response => {
      body = response.data;
      return body;
    })
    .catch(error => {
      return error
    })

    return result;
}


module.exports = {
    POST,
    GET,
    DELETE,
    PUT
}