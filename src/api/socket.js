export { sendSock }

var websock = null
var globaCallback = null

const ws = 'ws://192.168.200.200:4649/Echo'
// 初始化websocket
function initWebSocket() {
  websock = new WebSocket(ws)
  websock.onmessage = function(e) {
    websocketonmessage(e)
  }
  websock.onclose = function(e) {
    websockclose(e)
  }
  websock.onopen = function() {
    websocketopen()
  }
  websock.onerror = function() {}
}

//发送请求
function sendSock(agentData, callback) {
  globaCallback = callback
  if (websock.readyState === websock.OPEN) {
    //   websock连接成功发送请求
    websocketsend(agentData)
  } else if (websock.readyState === websock.CONNECTING) {
    //   正在开启状态
    setTimeout(function() {
      sendSock(agentData, callback)
    }, 300)
  } else {
    //   没有开启，等待重新调用
    setTimeout(function() {
      sendSock(agentData, callback)
    }, 1000)
  }
}

// 数据接收
function websocketonmessage(e) {
  globaCallback(JSON.parse(e.data))
}

//数据发送
function websocketsend(agentData) {
  websock.send(JSON.stringify(agentData))
}

// 关闭
function websockclose(e) {
  alert('websocket连接关闭！' + e)
}

// 船舰websocket连接
function websocketopen() {
  // console.log(e)
}

initWebSocket()
