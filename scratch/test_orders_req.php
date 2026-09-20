<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::first();

$request = Illuminate\Http\Request::create('/orders', 'GET');
$app->instance('request', $request);
auth()->setUser($user);

$response = $kernel->handle($request);

echo "Status: " . $response->getStatusCode() . "\n";
if ($response->isRedirection()) {
    echo "Redirect target: " . $response->headers->get('Location') . "\n";
} else {
    $content = $response->getContent();
    echo "Length: " . strlen($content) . "\n";
    preg_match('/<div id="app" data-page="(.*?)"><\/div>/', $content, $m);
    if (!empty($m[1])) {
        $pageData = htmlspecialchars_decode($m[1], ENT_QUOTES);
        $json = json_decode($pageData, true);
        echo "Component: " . ($json['component'] ?? 'UNKNOWN') . "\n";
        echo "Props keys: " . implode(', ', array_keys($json['props'] ?? [])) . "\n";
        echo "Orders count: " . count($json['props']['orders']['data'] ?? []) . "\n";
        echo "Stats: " . json_encode($json['props']['stats'] ?? []) . "\n";
        echo "Auth user: " . json_encode($json['props']['auth'] ?? []) . "\n";
    }
}
