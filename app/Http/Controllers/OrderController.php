<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display a listing of orders with filters and statistics.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $query = Order::with(['customer', 'items.product', 'user'])
            ->latest('order_date')
            ->latest('id');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($cq) use ($search) {
                      $cq->where('name', 'like', "%{$search}%")
                         ->orWhere('phone', 'like', "%{$search}%");
                  });
            });
        }

        if ($status && in_array($status, ['Pending', 'Shipped', 'Delivered', 'Cancelled'])) {
            $query->where('status', $status);
        }

        $orders = $query->paginate(10)->withQueryString();

        // Calculate KPI Statistics
        $stats = [
            'total_orders' => Order::count(),
            'pending_count' => Order::where('status', 'Pending')->count(),
            'shipped_count' => Order::where('status', 'Shipped')->count(),
            'delivered_count' => Order::where('status', 'Delivered')->count(),
            'total_revenue' => Order::where('status', '!=', 'Cancelled')->sum('total_amount'),
        ];

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? '',
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new order.
     */
    public function create(): Response
    {
        return Inertia::render('Orders/Create', [
            'customers' => Customer::orderBy('name')->get(),
            'products' => Product::orderBy('name')->get(),
            'defaultOrderNumber' => Order::generateOrderNumber(),
        ]);
    }

    /**
     * Store a newly created order in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'order_date' => 'required|date',
            'status' => 'required|in:Pending,Shipped,Delivered,Cancelled',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated, $request) {
            $totalAmount = 0;
            foreach ($validated['items'] as $item) {
                $totalAmount += $item['quantity'] * $item['unit_price'];
            }

            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'customer_id' => $validated['customer_id'],
                'user_id' => $request->user()?->id,
                'status' => $validated['status'],
                'total_amount' => $totalAmount,
                'notes' => $validated['notes'] ?? null,
                'order_date' => $validated['order_date'],
            ]);

            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $item['quantity'] * $item['unit_price'],
                ]);
            }
        });

        return redirect()->route('orders.index')->with('success', 'สร้างใบสั่งซื้อสำเร็จเรียบร้อยแล้ว');
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order): Response
    {
        $order->load(['customer', 'items.product', 'user']);

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Show the form for editing the specified order.
     */
    public function edit(Order $order): Response
    {
        $order->load(['customer', 'items.product']);

        return Inertia::render('Orders/Edit', [
            'order' => $order,
            'customers' => Customer::orderBy('name')->get(),
            'products' => Product::orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified order in storage.
     */
    public function update(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'order_date' => 'required|date',
            'status' => 'required|in:Pending,Shipped,Delivered,Cancelled',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated, $order) {
            $totalAmount = 0;
            foreach ($validated['items'] as $item) {
                $totalAmount += $item['quantity'] * $item['unit_price'];
            }

            $order->update([
                'customer_id' => $validated['customer_id'],
                'status' => $validated['status'],
                'total_amount' => $totalAmount,
                'notes' => $validated['notes'] ?? null,
                'order_date' => $validated['order_date'],
            ]);

            // Replace order items
            $order->items()->delete();

            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $item['quantity'] * $item['unit_price'],
                ]);
            }
        });

        return redirect()->route('orders.show', $order->id)->with('success', 'อัปเดตใบสั่งซื้อเรียบร้อยแล้ว');
    }

    /**
     * Remove the specified order from storage.
     */
    public function destroy(Order $order): RedirectResponse
    {
        $order->delete();

        return redirect()->route('orders.index')->with('success', 'ลบใบสั่งซื้อเรียบร้อยแล้ว');
    }

    /**
     * Fast update order status (Pending -> Shipped -> Delivered).
     */
    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:Pending,Shipped,Delivered,Cancelled',
        ]);

        $order->update(['status' => $validated['status']]);

        return back()->with('success', "อัปเดตสถานะออเดอร์เป็น {$validated['status']} สำเร็จ");
    }

    /**
     * Display printable receipt view for direct printing / PDF save.
     */
    public function receipt(Order $order): Response
    {
        $order->load(['customer', 'items.product', 'user']);

        return Inertia::render('Orders/Receipt', [
            'order' => $order,
        ]);
    }
}
