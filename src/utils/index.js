/*
 * @Author: your name
 * @Date: 2021-01-12 09:38:09
 * @LastEditTime: 2021-03-17 10:48:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue3-element-admin\src\utils\index.js
 */

/**
 * @description 格式化金额
 * @param
 * @return
 */
export function formatMoney(s) {
  if (s === 0) {
    return '0.00'
  } else if (s === '' || s == null) {
    return ''
  }
  var n = 2
  var b = parseFloat(s)
  n = n > 0 && n <= 20 ? n : 2
  if (b < 0) {
    s = (-1 * parseFloat((s + '').replace(/[^\d\.-]/g, ''))).toFixed(n) + ''
  } else {
    s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + ''
  }
  var l = s
    .split('.')[0]
    .split('')
    .reverse()
  var r = s.split('.')[1]
  var t = ''
  for (var i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? ',' : '')
  }
  if (b < 0) {
    return (
      '-' +
      t
        .split('')
        .reverse()
        .join('') +
      '.' +
      r
    )
  } else {
    return (
      t
        .split('')
        .reverse()
        .join('') +
      '.' +
      r
    )
  }
}

/**
 * @description:树形结构转一维数组
 * @param {*} nodes
 * @return {*}
 */
export function jsonToArray(nodes) {
  let pid = -1
  const toArray = nodes => {
    let r = []
    if (Array.isArray(nodes)) {
      for (let i = 0, l = nodes.length; i < l; i++) {
        nodes[i].pid = pid
        r.push(nodes[i]) // 取每项数据放入一个新数组
        if (Array.isArray(nodes[i]['children']) && nodes[i]['children'].length > 0) {
          // 若存在children则递归调用，把数据拼接到新数组中，并且删除该children
          pid = nodes[i].id
          r = r.concat(toArray(nodes[i]['children']))
          delete nodes[i]['children']
        }
      }
    }
    return r
  }
  return toArray(nodes)
}

/**
 * @description:一维数组转树形结构
 * @param {*} treeArray
 * @return {*}
 */
export function arrayToJson(treeArray) {
  var r = []
  var tmpMap = {}
  for (var i = 0, l = treeArray.length; i < l; i++) {
    //* 以每条数据的id作为obj的key值，数据作为value值存入到一个临时对象里面
    tmpMap[treeArray[i]['id']] = treeArray[i]
  }
  for (i = 0, l = treeArray.length; i < l; i++) {
    var key = tmpMap[treeArray[i]['pid']]
    //*循环每一条数据的pid，假如这个临时对象有这个key值，就代表这个key对应的数据有children，需要Push进去
    //*如果这一项数据属于哪个数据的子级
    if (key) {
      // *如果这个数据没有children
      if (!key['children']) {
        key['children'] = []
        key['children'].push(treeArray[i])
        //* 如果这个数据有children
      } else {
        key['children'].push(treeArray[i])
      }
    } else {
      //*如果没有这个Key值，就代表找不到属于哪个数据，那就代表没有父级,直接放在最外层
      r.push(treeArray[i])
    }
  }
  return r
}

/**
 * @description 获取节点的所有父节点
 * @param {*} tree
 * @param {*} func
 * @param {*} path
 * @return {*}
 */
export const treeFindPath = (tree, func, name = 'id', path = []) => {
  if (!tree) return []
  for (const data of tree) {
    //* 这里按照你的需求来存放最后返回的内容吧
    path.push(data[name])
    if (func(data)) return path
    if (data.children) {
      const findChildren = treeFindPath(data.children, func, name, path)
      if (findChildren.length) return findChildren
    }
    path.pop()
  }
  return []
}

/**
 * @description: 拆箱函数,解决tooltip显示问题
 * @param {*} obj
 * @return {*}
 */
export const unwarp = obj => obj && (obj.__v_raw || obj.valueOf() || obj)
export const icons = [
  'el-icon-platform-eleme',
  'el-icon-eleme',
  'el-icon-delete-solid',
  'el-icon-delete',
  'el-icon-s-tools',
  'el-icon-setting',
  'el-icon-user-solid',
  'el-icon-user',
  'el-icon-phone',
  'el-icon-phone-outline',
  'el-icon-more',
  'el-icon-more-outline',
  'el-icon-star-on',
  'el-icon-star-off',
  'el-icon-s-goods',
  'el-icon-goods',
  'el-icon-warning',
  'el-icon-warning-outline',
  'el-icon-question',
  'el-icon-info',
  'el-icon-remove',
  'el-icon-circle-plus',
  'el-icon-success',
  'el-icon-error',
  'el-icon-zoom-in',
  'el-icon-zoom-out',
  'el-icon-remove-outline',
  'el-icon-circle-plus-outline',
  'el-icon-circle-check',
  'el-icon-circle-close',
  'el-icon-s-help',
  'el-icon-help',
  'el-icon-minus',
  'el-icon-plus',
  'el-icon-check',
  'el-icon-close',
  'el-icon-picture',
  'el-icon-picture-outline',
  'el-icon-picture-outline-round',
  'el-icon-upload',
  'el-icon-upload2',
  'el-icon-download',
  'el-icon-camera-solid',
  'el-icon-camera',
  'el-icon-video-camera-solid',
  'el-icon-video-camera',
  'el-icon-message-solid',
  'el-icon-bell',
  'el-icon-s-cooperation',
  'el-icon-s-order',
  'el-icon-s-platform',
  'el-icon-s-fold',
  'el-icon-s-unfold',
  'el-icon-s-operation',
  'el-icon-s-promotion',
  'el-icon-s-home',
  'el-icon-s-release',
  'el-icon-s-ticket',
  'el-icon-s-management',
  'el-icon-s-open',
  'el-icon-s-shop',
  'el-icon-s-marketing',
  'el-icon-s-flag',
  'el-icon-s-comment',
  'el-icon-s-finance',
  'el-icon-s-claim',
  'el-icon-s-custom',
  'el-icon-s-opportunity',
  'el-icon-s-data',
  'el-icon-s-check',
  'el-icon-s-grid',
  'el-icon-menu',
  'el-icon-share',
  'el-icon-d-caret',
  'el-icon-caret-left',
  'el-icon-caret-right',
  'el-icon-caret-bottom',
  'el-icon-caret-top',
  'el-icon-bottom-left',
  'el-icon-bottom-right',
  'el-icon-back',
  'el-icon-right',
  'el-icon-bottom',
  'el-icon-top',
  'el-icon-top-left',
  'el-icon-top-right',
  'el-icon-arrow-left',
  'el-icon-arrow-right',
  'el-icon-arrow-down',
  'el-icon-arrow-up',
  'el-icon-d-arrow-left',
  'el-icon-d-arrow-right',
  'el-icon-video-pause',
  'el-icon-video-play',
  'el-icon-refresh',
  'el-icon-refresh-right',
  'el-icon-refresh-left',
  'el-icon-finished',
  'el-icon-sort',
  'el-icon-sort-up',
  'el-icon-sort-down',
  'el-icon-rank',
  'el-icon-loading',
  'el-icon-view',
  'el-icon-c-scale-to-original',
  'el-icon-date',
  'el-icon-edit',
  'el-icon-edit-outline',
  'el-icon-folder',
  'el-icon-folder-opened',
  'el-icon-folder-add',
  'el-icon-folder-remove',
  'el-icon-folder-delete',
  'el-icon-folder-checked',
  'el-icon-tickets',
  'el-icon-document-remove',
  'el-icon-document-delete',
  'el-icon-document-copy',
  'el-icon-document-checked',
  'el-icon-document',
  'el-icon-document-add',
  'el-icon-printer',
  'el-icon-paperclip',
  'el-icon-takeaway-box',
  'el-icon-search',
  'el-icon-monitor',
  'el-icon-attract',
  'el-icon-mobile',
  'el-icon-scissors',
  'el-icon-umbrella',
  'el-icon-headset',
  'el-icon-brush',
  'el-icon-mouse',
  'el-icon-coordinate',
  'el-icon-magic-stick',
  'el-icon-reading',
  'el-icon-data-line',
  'el-icon-data-board',
  'el-icon-pie-chart',
  'el-icon-data-analysis',
  'el-icon-collection-tag',
  'el-icon-film',
  'el-icon-suitcase',
  'el-icon-suitcase-1',
  'el-icon-receiving',
  'el-icon-collection',
  'el-icon-files',
  'el-icon-notebook-1',
  'el-icon-notebook-2',
  'el-icon-toilet-paper',
  'el-icon-office-building',
  'el-icon-school',
  'el-icon-table-lamp',
  'el-icon-house',
  'el-icon-no-smoking',
  'el-icon-smoking',
  'el-icon-shopping-cart-full',
  'el-icon-shopping-cart-1',
  'el-icon-shopping-cart-2',
  'el-icon-shopping-bag-1',
  'el-icon-shopping-bag-2',
  'el-icon-sold-out',
  'el-icon-sell',
  'el-icon-present',
  'el-icon-box',
  'el-icon-bank-card',
  'el-icon-money',
  'el-icon-coin',
  'el-icon-wallet',
  'el-icon-discount',
  'el-icon-price-tag',
  'el-icon-news',
  'el-icon-guide',
  'el-icon-male',
  'el-icon-female',
  'el-icon-thumb',
  'el-icon-cpu',
  'el-icon-link',
  'el-icon-connection',
  'el-icon-open',
  'el-icon-turn-off',
  'el-icon-set-up',
  'el-icon-chat-round',
  'el-icon-chat-line-round',
  'el-icon-chat-square',
  'el-icon-chat-dot-round',
  'el-icon-chat-dot-square',
  'el-icon-chat-line-square',
  'el-icon-message',
  'el-icon-postcard',
  'el-icon-position',
  'el-icon-turn-off-microphone',
  'el-icon-microphone',
  'el-icon-close-notification',
  'el-icon-bangzhu',
  'el-icon-time',
  'el-icon-odometer',
  'el-icon-crop',
  'el-icon-aim',
  'el-icon-switch-button',
  'el-icon-full-screen',
  'el-icon-copy-document',
  'el-icon-mic',
  'el-icon-stopwatch',
  'el-icon-medal-1',
  'el-icon-medal',
  'el-icon-trophy',
  'el-icon-trophy-1',
  'el-icon-first-aid-kit',
  'el-icon-discover',
  'el-icon-place',
  'el-icon-location',
  'el-icon-location-outline',
  'el-icon-location-information',
  'el-icon-add-location',
  'el-icon-delete-location',
  'el-icon-map-location',
  'el-icon-alarm-clock',
  'el-icon-timer',
  'el-icon-watch-1',
  'el-icon-watch',
  'el-icon-lock',
  'el-icon-unlock',
  'el-icon-key',
  'el-icon-service',
  'el-icon-mobile-phone',
  'el-icon-bicycle',
  'el-icon-truck',
  'el-icon-ship',
  'el-icon-basketball',
  'el-icon-football',
  'el-icon-soccer',
  'el-icon-baseball',
  'el-icon-wind-power',
  'el-icon-light-rain',
  'el-icon-lightning',
  'el-icon-heavy-rain',
  'el-icon-sunrise',
  'el-icon-sunrise-1',
  'el-icon-sunset',
  'el-icon-sunny',
  'el-icon-cloudy',
  'el-icon-partly-cloudy',
  'el-icon-cloudy-and-sunny',
  'el-icon-moon',
  'el-icon-moon-night',
  'el-icon-dish',
  'el-icon-dish-1',
  'el-icon-food',
  'el-icon-chicken',
  'el-icon-fork-spoon',
  'el-icon-knife-fork',
  'el-icon-burger',
  'el-icon-tableware',
  'el-icon-sugar',
  'el-icon-dessert',
  'el-icon-ice-cream',
  'el-icon-hot-water',
  'el-icon-water-cup',
  'el-icon-coffee-cup',
  'el-icon-cold-drink',
  'el-icon-goblet',
  'el-icon-goblet-full',
  'el-icon-goblet-square',
  'el-icon-goblet-square-full',
  'el-icon-refrigerator',
  'el-icon-grape',
  'el-icon-watermelon',
  'el-icon-cherry',
  'el-icon-apple',
  'el-icon-pear',
  'el-icon-orange',
  'el-icon-coffee',
  'el-icon-ice-tea',
  'el-icon-ice-drink',
  'el-icon-milk-tea',
  'el-icon-potato-strips',
  'el-icon-lollipop',
  'el-icon-ice-cream-square',
  'el-icon-ice-cream-round'
]

export const sign = (tooken, time, appKey, d) => {
  function a(e) {
    function t(e, t) {
      return (e << t) | (e >>> (32 - t))
    }
    function r(e, t) {
      var r, n, o, a, i
      return (
        (o = 2147483648 & e),
        (a = 2147483648 & t),
        (r = 1073741824 & e),
        (n = 1073741824 & t),
        (i = (1073741823 & e) + (1073741823 & t)),
        r & n
          ? 2147483648 ^ i ^ o ^ a
          : r | n
          ? 1073741824 & i
            ? 3221225472 ^ i ^ o ^ a
            : 1073741824 ^ i ^ o ^ a
          : i ^ o ^ a
      )
    }
    function n(e, t, r) {
      return (e & t) | (~e & r)
    }
    function o(e, t, r) {
      return (e & r) | (t & ~r)
    }
    function a(e, t, r) {
      return e ^ t ^ r
    }
    function i(e, t, r) {
      return t ^ (e | ~r)
    }
    function u(e, o, a, i, u, s, l) {
      return (e = r(e, r(r(n(o, a, i), u), l))), r(t(e, s), o)
    }
    function s(e, n, a, i, u, s, l) {
      return (e = r(e, r(r(o(n, a, i), u), l))), r(t(e, s), n)
    }
    function l(e, n, o, i, u, s, l) {
      return (e = r(e, r(r(a(n, o, i), u), l))), r(t(e, s), n)
    }
    function c(e, n, o, a, u, s, l) {
      return (e = r(e, r(r(i(n, o, a), u), l))), r(t(e, s), n)
    }
    function f(e) {
      var t = '',
        r = '',
        n,
        o
      for (o = 0; o <= 3; o++)
        (n = (e >>> (8 * o)) & 255), (r = '0' + n.toString(16)), (t += r.substr(r.length - 2, 2))
      return t
    }
    var d = [],
      p,
      h,
      g,
      A,
      _,
      m,
      v,
      y,
      b,
      S = 7,
      x = 12,
      E = 17,
      w = 22,
      O = 5,
      R = 9,
      D = 14,
      C = 20,
      T = 4,
      P = 11,
      I = 16,
      M = 23,
      k = 6,
      N = 10,
      j = 15,
      q = 21
    for (
      e = (function(e) {
        e = e.replace(/\r\n/g, '\n')
        for (var t = '', r = 0; r < e.length; r++) {
          var n = e.charCodeAt(r)
          n < 128
            ? (t += String.fromCharCode(n))
            : n > 127 && n < 2048
            ? ((t += String.fromCharCode((n >> 6) | 192)),
              (t += String.fromCharCode((63 & n) | 128)))
            : ((t += String.fromCharCode((n >> 12) | 224)),
              (t += String.fromCharCode(((n >> 6) & 63) | 128)),
              (t += String.fromCharCode((63 & n) | 128)))
        }
        return t
      })(e),
        d = (function(e) {
          for (
            var t,
              r = e.length,
              n = r + 8,
              o = 16 * ((n - (n % 64)) / 64 + 1),
              a = new Array(o - 1),
              i = 0,
              u = 0;
            u < r;

          )
            (t = (u - (u % 4)) / 4), (i = (u % 4) * 8), (a[t] = a[t] | (e.charCodeAt(u) << i)), u++
          return (
            (t = (u - (u % 4)) / 4),
            (i = (u % 4) * 8),
            (a[t] = a[t] | (128 << i)),
            (a[o - 2] = r << 3),
            (a[o - 1] = r >>> 29),
            a
          )
        })(e),
        m = 1732584193,
        v = 4023233417,
        y = 2562383102,
        b = 271733878,
        p = 0;
      p < d.length;
      p += 16
    )
      (h = m),
        (g = v),
        (A = y),
        (_ = b),
        (m = u(m, v, y, b, d[p + 0], 7, 3614090360)),
        (b = u(b, m, v, y, d[p + 1], 12, 3905402710)),
        (y = u(y, b, m, v, d[p + 2], 17, 606105819)),
        (v = u(v, y, b, m, d[p + 3], 22, 3250441966)),
        (m = u(m, v, y, b, d[p + 4], 7, 4118548399)),
        (b = u(b, m, v, y, d[p + 5], 12, 1200080426)),
        (y = u(y, b, m, v, d[p + 6], 17, 2821735955)),
        (v = u(v, y, b, m, d[p + 7], 22, 4249261313)),
        (m = u(m, v, y, b, d[p + 8], 7, 1770035416)),
        (b = u(b, m, v, y, d[p + 9], 12, 2336552879)),
        (y = u(y, b, m, v, d[p + 10], 17, 4294925233)),
        (v = u(v, y, b, m, d[p + 11], 22, 2304563134)),
        (m = u(m, v, y, b, d[p + 12], 7, 1804603682)),
        (b = u(b, m, v, y, d[p + 13], 12, 4254626195)),
        (y = u(y, b, m, v, d[p + 14], 17, 2792965006)),
        (v = u(v, y, b, m, d[p + 15], 22, 1236535329)),
        (m = s(m, v, y, b, d[p + 1], 5, 4129170786)),
        (b = s(b, m, v, y, d[p + 6], 9, 3225465664)),
        (y = s(y, b, m, v, d[p + 11], 14, 643717713)),
        (v = s(v, y, b, m, d[p + 0], 20, 3921069994)),
        (m = s(m, v, y, b, d[p + 5], 5, 3593408605)),
        (b = s(b, m, v, y, d[p + 10], 9, 38016083)),
        (y = s(y, b, m, v, d[p + 15], 14, 3634488961)),
        (v = s(v, y, b, m, d[p + 4], 20, 3889429448)),
        (m = s(m, v, y, b, d[p + 9], 5, 568446438)),
        (b = s(b, m, v, y, d[p + 14], 9, 3275163606)),
        (y = s(y, b, m, v, d[p + 3], 14, 4107603335)),
        (v = s(v, y, b, m, d[p + 8], 20, 1163531501)),
        (m = s(m, v, y, b, d[p + 13], 5, 2850285829)),
        (b = s(b, m, v, y, d[p + 2], 9, 4243563512)),
        (y = s(y, b, m, v, d[p + 7], 14, 1735328473)),
        (v = s(v, y, b, m, d[p + 12], 20, 2368359562)),
        (m = l(m, v, y, b, d[p + 5], 4, 4294588738)),
        (b = l(b, m, v, y, d[p + 8], 11, 2272392833)),
        (y = l(y, b, m, v, d[p + 11], 16, 1839030562)),
        (v = l(v, y, b, m, d[p + 14], 23, 4259657740)),
        (m = l(m, v, y, b, d[p + 1], 4, 2763975236)),
        (b = l(b, m, v, y, d[p + 4], 11, 1272893353)),
        (y = l(y, b, m, v, d[p + 7], 16, 4139469664)),
        (v = l(v, y, b, m, d[p + 10], 23, 3200236656)),
        (m = l(m, v, y, b, d[p + 13], 4, 681279174)),
        (b = l(b, m, v, y, d[p + 0], 11, 3936430074)),
        (y = l(y, b, m, v, d[p + 3], 16, 3572445317)),
        (v = l(v, y, b, m, d[p + 6], 23, 76029189)),
        (m = l(m, v, y, b, d[p + 9], 4, 3654602809)),
        (b = l(b, m, v, y, d[p + 12], 11, 3873151461)),
        (y = l(y, b, m, v, d[p + 15], 16, 530742520)),
        (v = l(v, y, b, m, d[p + 2], 23, 3299628645)),
        (m = c(m, v, y, b, d[p + 0], 6, 4096336452)),
        (b = c(b, m, v, y, d[p + 7], 10, 1126891415)),
        (y = c(y, b, m, v, d[p + 14], 15, 2878612391)),
        (v = c(v, y, b, m, d[p + 5], 21, 4237533241)),
        (m = c(m, v, y, b, d[p + 12], 6, 1700485571)),
        (b = c(b, m, v, y, d[p + 3], 10, 2399980690)),
        (y = c(y, b, m, v, d[p + 10], 15, 4293915773)),
        (v = c(v, y, b, m, d[p + 1], 21, 2240044497)),
        (m = c(m, v, y, b, d[p + 8], 6, 1873313359)),
        (b = c(b, m, v, y, d[p + 15], 10, 4264355552)),
        (y = c(y, b, m, v, d[p + 6], 15, 2734768916)),
        (v = c(v, y, b, m, d[p + 13], 21, 1309151649)),
        (m = c(m, v, y, b, d[p + 4], 6, 4149444226)),
        (b = c(b, m, v, y, d[p + 11], 10, 3174756917)),
        (y = c(y, b, m, v, d[p + 2], 15, 718787259)),
        (v = c(v, y, b, m, d[p + 9], 21, 3951481745)),
        (m = r(m, h)),
        (v = r(v, g)),
        (y = r(y, A)),
        (b = r(b, _))
    return (f(m) + f(v) + f(y) + f(b)).toLowerCase()
  }
  return a(tooken + '&' + time + '&' + appKey + '&' + JSON.stringify(d))
}

export const initTime = () => {
  let h = new Date().getHours()
  let m = new Date().getMinutes()
  let date
  if (m < 30) {
    date = new Date().setHours(h, 30, 0, 0)
  } else {
    date = new Date().setHours(h + 1, 0, 0, 0)
  }
  return new Date(date).Format('yyyy/MM/dd hh:mm:ss')
}
export const getCookie = (strCookie, cookieName) => {
  const cookieList = strCookie.split(';')
  for (let i = 0; i < cookieList.length; i++) {
    const arr = cookieList[i].split('=')
    if (cookieName === arr[0].trim()) {
      return arr[1]
    }
  }
  return ''
}
