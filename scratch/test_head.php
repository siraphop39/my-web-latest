<?php
$html = file_get_contents('http://127.0.0.1:8000/login');
preg_match('/<head>(.*?)<\/head>/s', $html, $m);
echo $m[1] ?? 'NOT FOUND';
