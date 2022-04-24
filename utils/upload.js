/*
归类为上传图片和视频
图片：房源图片上传、用户头像收款码更新
视频：房源视频上传

*/


// 房源图片上传
/**
 * @desc 上传文件
 * @param FileUrl 需上传文件的路径
 * @param  fileName 兼容H5 包含上传文件名的字符串 aa/bb.jpg
 * @param  basePath 上传到OSS的文件夹 首字符不包含/
 * @param  type 上传文件的文件类型 图像image 视频video
 * @returns 上传成功返回 resolve云文件URL reject错误
 */

export const upload = (params) => {

    let FileUrl = params.FileUrl || "";
    let fileName = params.fileName || "";
    let fileType = params.fileType || "";
    let basePath = params.basePath || "";
    let ossSignature = params.ossSignature || "";

    return new Promise(async (resolve, reject) => {
        // 组成key
        let pathArr = fileName.split(".");
        let randomID = uuid4(8, 16).toLowerCase()
        let fileKey = basePath + Date.now() + randomID + "." + pathArr[pathArr.length - 1];;
        // 开始上传
        uni.uploadFile({
            url: ossSignature.host,
            filePath: FileUrl,
            fileType: fileType,
            name: "file",
            formData: {
                key: fileKey,
                policy: ossSignature.policy,
                OSSAccessKeyId: ossSignature.accessid,
                success_action_status: "200", // 让服务端返回200,不然，默认会返回204
                signature: ossSignature.signature,
            },
            success: (res) => {
                if (res.statusCode == "200") {
                    let cloudUrl = ossSignature.host + "/" + fileKey
                    resolve(cloudUrl)

                } else {
                    reject(res)
                }
            },
            fail: (err) => {
                reject(err)
            },
        });

    })
}


function uuid4(len, radix) {
    var chars =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split('');
    var uuid = [],
        i;
    radix = radix || chars.length;
    if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
    } else {
        var r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
        uuid[14] = "4";
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | (Math.random() * 16);
                uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join("");
}

