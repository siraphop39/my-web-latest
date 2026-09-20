const vm = require('vm');
const http = require('http');

http.get('http://127.0.0.1:8000/login', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const match = data.match(/<script type="text\/javascript">(const Ziggy=.*?<\/script>)/s);
        if (!match) {
            console.log("No Ziggy script found in /login!");
            return;
        }
        const scriptCode = match[1].replace(/<\/script>/, '');
        
        const sandbox = {
            window: {},
            self: {},
            document: {
                getElementById: () => null,
            },
            location: {
                host: '127.0.0.1:8000',
                pathname: '/orders',
                search: '',
            }
        };
        sandbox.window = sandbox;
        sandbox.self = sandbox;
        sandbox.globalThis = sandbox;

        vm.createContext(sandbox);
        try {
            vm.runInContext(scriptCode, sandbox);
            console.log("Ziggy script executed successfully!");
            console.log("route defined?", typeof sandbox.route);
            
            const url = sandbox.route('orders.index');
            console.log("route('orders.index') =", url);

            const isCurrent = sandbox.route().current('orders.*');
            console.log("route().current('orders.*') =", isCurrent);

            console.log("route('orders.create') =", sandbox.route('orders.create'));
        } catch (e) {
            console.error("ZIGGY EXECUTION ERROR:", e);
        }
    });
});
