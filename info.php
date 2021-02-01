<?php

$data                       =   [
    'HTTP_X_FORWARDED_FOR'  =>  $_SERVER['HTTP_X_FORWARDED_FOR'],
    'HTTP_CF_CONNECTING_IP' =>  $_SERVER['HTTP_CF_CONNECTING_IP'],
    'HTTP_CF_IPCOUNTRY'     =>  $_SERVER['HTTP_CF_IPCOUNTRY'],
    'HTTP_CF_RAY'           =>  $_SERVER['HTTP_CF_RAY'],
    'HTTP_CF_VISITOR'       =>  json_decode($_SERVER['HTTP_CF_VISITOR']),
    'HTTP_CDN_LOOP'         =>  $_SERVER['HTTP_CDN_LOOP'],
];

header('content-type:application/json');
echo json_encode($data);
