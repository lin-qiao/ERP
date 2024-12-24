var main = null;
var filter = null;
var receiver = null;
var index = null;
var pda = {
  initScan() {
    //  #ifdef APP
    main = plus.android.runtimeMainActivity(); //获取activity
    var context = plus.android.importClass("android.content.Context"); //上下文
    var IntentFilter = plus.android.importClass("android.content.IntentFilter");
    var Intent = plus.android.importClass("android.content.Intent");
    filter = new IntentFilter();
    //获取action
    filter.addAction("android.intent.ACTION_DECODE_DATA");

    receiver = plus.android.implements(
      "io.dcloud.feature.internal.reflect.BroadcastReceiver",
      {
        onReceive: (context, intent) => {
          plus.android.importClass(intent);
          //条码内容
          var barcodeBytes = intent.getByteArrayExtra("barcode");
          var barcode = byteToString(barcodeBytes);
          //拿到当前页面
          var nowPage = getCurrentPages().pop();
          //调用当前页面的方法,将结果传递过去
          nowPage.$vm.handlePdaScan &&
            nowPage.$vm.handlePdaScan(barcode, index);
        },
      }
    );
    // #endif
  },
  startScan() {
    main.registerReceiver(receiver, filter);
  },
  stopScan() {
    main.unregisterReceiver(receiver);
  },
};

function byteToString(arr) {
  if (typeof arr === "string") {
    return arr;
  }
  var str = "",
    _arr = arr;
  for (var i = 0; i < _arr.length; i++) {
    var one = _arr[i].toString(2),
      v = one.match(/^1+?(?=0)/);
    if (v && one.length == 8) {
      var bytesLength = v[0].length;
      var store = _arr[i].toString(2).slice(7 - bytesLength);
      for (var st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2);
      }
      str += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
    } else {
      str += String.fromCharCode(_arr[i]);
    }
  }
  return str;
}
export default pda;
