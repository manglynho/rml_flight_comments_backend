const Gateway = require('../models/gateway')
const Device = require('../models/device')


const nonExistingGatewayId = async () => {
  const gateway = new Gateway({
    serial: 'HHHPPP9999',
    name: 'Some Gateway',
    ip_v4: '192.168.22.99'
  })
  await gateway.save()
  await gateway.remove()

  return gateway._id.toString()
}

const gatewaysInDb = async () => {
  const gateways = await Gateway.find({})
  return gateways.map(gateway => gateway.toJSON())
}

const nonExistingDeviceId = async () => {
  const device = new Device({
    uid: '90909099',
    vendor: 'Some Vendor',
    date: new Date(),
    status: true,
    gateway: '5a422a851b54a676234d17f7',
  })
  await device.save()
  await device.remove()

  return device._id.toString()
}

const devicesInDb = async () => {
  const devices = await Device.find({})
  return devices.map(device => device.toJSON())
}

module.exports = {
  nonExistingGatewayId, nonExistingDeviceId, gatewaysInDb, devicesInDb
}