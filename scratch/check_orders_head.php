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
$content = $response->getContent();

preg_match('/<head>(.*?)<\/head>/s', $content, $m);
$head = $m[1] ?? '';
$lines = explode("\n", $head);
echo "LINE 13:\n" . ($lines[12] ?? '') . "\n";
