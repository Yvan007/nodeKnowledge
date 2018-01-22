import { AliyunSmgConfig} from '../config/config'
import { getSecond , getCode } from './common'
import { RegisterCode ,PasswordCode } from '../modles'
const { accessKeyId,secretAccessKey,singName,registerTemplateCode,findPasswordTemplateCode } = AliyunSmgConfig
const SMSClient = require('@alicloud/sms-sdk')
//初始化sms_client
let smsClient = new SMSClient({accessKeyId, secretAccessKey})
//发送短信
export async function _sendRegisterCode(phone) {
    const ctime = getSecond()
    const code  = getCode()
    const body  = {}
    await smsClient.sendSMS({
        PhoneNumbers: phone,
        SignName: singName,
        TemplateCode: registerTemplateCode,
        TemplateParam: `{"number":"${code}","product":"云通信"}`
    }).then(function (res) {
        let {Code}=res
        if (Code === 'OK') {
            console.log(res)
            
            body.code = 0
        }
    }, function (err) {
        console.log(err)
        body.code = err.code
    })
    if(body.code == 0) {
      const registerCode = await recordRegisterCode(phone,code,ctime)
      if(!registerCode) {
        body.code = -1
      }
    }
    return body
}
async function recordRegisterCode(phone,code,ctime) {
    let registerCode = await RegisterCode.findOne({where:{phone}})
    if(registerCode) {
        registerCode.code   = code
        registerCode.ctime  = ctime
        registerCode.status = 1
        await registerCode.save()
    } else {
        registerCode = await RegisterCode.create({
            phone,code,ctime,status:1
        })
    }
    return registerCode
}
export async function _sendFindPasswordCode(phone) {
    const ctime = getSecond()
    const code  = getCode()
    const body  = {}
    await smsClient.sendSMS({
        PhoneNumbers: phone,
        SignName: singName,
        TemplateCode: findPasswordTemplateCode,
        TemplateParam: `{"number":"${code}","product":"云通信"}`
    }).then(function (res) {
        let {Code}=res
        if (Code === 'OK') {
            body.code = 0
        }
    }, function (err) {
        console.log(err)
        body.code = err.code
    })
    if(body.code == 0) {
      const passwordCode = await recordPasswordCode(phone,code,ctime)
      if(!passwordCode) {
        body.code = -1
      }
    }
    return body
}

async function recordPasswordCode(phone,code,ctime) {
    let passwordCode = await PasswordCode.findOne({where:{phone}})
    if(passwordCode) {
        passwordCode.code   = code
        passwordCode.ctime  = ctime
        passwordCode.status = 1
        await passwordCode.save()
    } else {
        passwordCode = await passwordCode.create({
            phone,code,ctime,status:1
        })
    }
    return passwordCode
}