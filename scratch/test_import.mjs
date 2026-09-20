// Mock browser globals
globalThis.window = globalThis;
globalThis.location = new URL('http://127.0.0.1:8000/orders');
globalThis.history = {
    scrollRestoration: 'auto',
    pushState: () => {},
    replaceState: () => {},
    state: {}
};
globalThis.route = (name) => `http://127.0.0.1:8000/${name}`;
globalThis.route.current = () => true;

globalThis.document = {
    getElementById: (id) => {
        if (id === 'app') {
            return {
                dataset: {
                    page: JSON.stringify({
                        component: 'Orders/Index',
                        props: {
                            auth: { user: { id: 1, name: 'Admin', email: 'admin@example.com' } },
                            orders: { data: [], links: [] },
                            filters: {},
                            stats: { total_orders: 0, pending_count: 0, shipped_count: 0, delivered_count: 0, total_revenue: 0 }
                        },
                        url: '/orders'
                    })
                }
            };
        }
        return null;
    },
    addEventListener: () => {},
    createElement: () => ({ setAttribute: () => {}, style: {} }),
    head: { append: () => {} }
};

try {
    const mod = await import('../public/build/assets/Index-C5xUVtU0.js');
    console.log("Successfully imported Index component:", mod.default ? "YES" : "NO");
    const comp = mod.default({
        orders: { data: [], links: [] },
        filters: {},
        stats: { total_orders: 0, pending_count: 0, shipped_count: 0, delivered_count: 0, total_revenue: 0 }
    });
    console.log("Component rendered without error! Type:", comp.$$typeof ? "React element" : typeof comp);
} catch (e) {
    console.error("IMPORT / RENDER ERROR:", e);
}
