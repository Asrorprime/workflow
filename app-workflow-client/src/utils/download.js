const download = {
  base64ToArrayBuffer: (base64) => {
    let binaryString = window.atob(base64);
    let binaryLen = binaryString.length;
    let bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  },

  saveByteArray: (reportName, byte) => {
    let blob = new Blob([byte], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = reportName;
    link.click();
  },
  apply: (response) => {
    let sampleArr = download.base64ToArrayBuffer(response.data);
    download.saveByteArray(response.contentDisposition.split('"')[1], sampleArr);
  },
  makeForm: (request) => {
    let columns = [];
    let fields = [];
    request.map(i => {
      Object.keys(i).map(key => {
        if (key === 'title' && i[key] !== 'Amallar' && i[key] !== 'TR') {
          columns.push(i[key])
        } else if (key === 'dataIndex' && i[key] !== 'icons'&&i[key]!=='id') {
          fields.push(i[key])
        }
      })
    });
    return {columns, fields}
  },
  convertToTimestamp(str, start) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-") + (start ? " 00:00:00" : " 23:59:59");
  },
};
export default download;

