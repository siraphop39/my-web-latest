<?php
$html = file_get_contents('http://127.0.0.1:8000/login');
echo substr($html, 0, 2000);
