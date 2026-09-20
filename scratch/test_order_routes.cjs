const vm = require('vm');
const http = require('http');

http.get('http://127.0.0.1:8000/login', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const match = data.match(/<script type="text\/javascript">(const Ziggy=.*?<\/script>)/s);
        const scriptCode = match[1].replace(/<\/script>/, '');
        
        const sandbox = {
            window: {},
            self: {},
            document: { getElementById: () => null },
            location: { host: '127.0.0.1:8000', pathname: '/orders', search: '' }
        };
        sandbox.window = sandbox;
        sandbox.self = sandbox;
        sandbox.globalThis = sandbox;

        vm.createContext(sandbox);
        vm.runInContext(scriptCode, sandbox);
        
        console.log("profile.edit in Ziggy?", sandbox.route().has('profile.edit'));
        console.log("profile.edit URL:", sandbox.route('profile.edit'));
        console.log("orders.index in Ziggy?", sandbox.route().has('orders.index'));
        console.log("orders.show in Ziggy?", sandbox.route().has('orders.show'));
    });
});
