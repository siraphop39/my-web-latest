<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderApiController extends Controller
{
    /**
     * List all orders with filters via API.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Order::with(['customer', 'items.product', 'user'])
            ->latest('order_date')
            ->latest('id');

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($cq) use ($search) {
                      $cq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $orders = $query->paginate($request->input('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    /**
     * Store order in database via API.
     */
    public function store(Request $request): JsonResponse
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

        $order = DB::transaction(function () use ($validated, $request) {
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

            return $order;
        });

        $order->load(['customer', 'items.product']);

        return response()->json([
            'success' => true,
            'message' => 'บันทึกคำสั่งซื้อลงฐานข้อมูลผ่าน API เรียบร้อยแล้ว',
            'data' => $order,
        ], 201);
    }

    /**
     * Get single order details via API.
     */
    public function show(Order $order): JsonResponse
    {
        $order->load(['customer', 'items.product', 'user']);

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    /**
     * Update order status via API.
     */
    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:Pending,Shipped,Delivered,Cancelled',
        ]);

        $order->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'message' => "อัปเดตสถานะออเดอร์เป็น {$validated['status']} สำเร็จ",
            'data' => $order,
        ]);
    }

    /**
     * Delete order via API.
     */
    public function destroy(Order $order): JsonResponse
    {
        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'ลบคำสั่งซื้อเรียบร้อยแล้ว',
        ]);
    }

    /**
     * List products via API.
     */
    public function getProducts(): JsonResponse
    {
        $products = Product::orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    /**
     * List customers via API.
     */
    public function getCustomers(): JsonResponse
    {
        $customers = Customer::orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $customers,
        ]);
    }

    /**
     * Quick create customer via API.
     */
    public function storeCustomer(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
        ]);

        $customer = Customer::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'เพิ่มข้อมูลลูกค้าสำเร็จ',
            'data' => $customer,
        ], 201);
    }
}
