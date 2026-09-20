<?php
$html = file_get_contents('http://127.0.0.1:8000/login');
preg_match('/<head>(.*?)<\/head>/s', $html, $m);
$head = $m[1] ?? '';
$lines = explode("\n", $head);
echo "END OF LINE 12:\n" . substr($lines[11] ?? '', -300) . "\n";
