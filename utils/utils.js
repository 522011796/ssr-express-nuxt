import Cookie from 'js-cookie'

const TOKEN_KEY = 'token'

export default {
    /**
     * 判断服务器端的cookie内容
     * 中间件无法获取到前端的cookie，所以才用header的方式
     * 如果是前端，直接通过js-cookie的方式
     */
    getcookiesInServer(req) {
        let service_cookie = {};
        req && req.headers.cookie && req.headers.cookie.split(';').forEach(function (val) {
            let parts = val.split('=');
            //console.log((parts[1] || '').trim());
            service_cookie[parts[0].trim()] = (parts[1] || '').trim();
        });
        return service_cookie;
    },
    //获取客户端cookie
    getcookiesInClient: function (key) {
        return Cookie.get(key) ? Cookie.get(key) : ''
    },
    setToken: function(token) {
      Cookie.set(TOKEN_KEY, token, {expires: 1 || 1})
    },
    getToken: function() {
      const token = Cookie.get(TOKEN_KEY)
      if (token) return token;
      else return false
    },
    removeToken: function () {
      Cookie.remove(TOKEN_KEY);
    }
}
