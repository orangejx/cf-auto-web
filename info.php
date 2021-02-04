<?php

$data                       =   [
    'HTTP_X_FORWARDED_FOR'  =>  $_SERVER['HTTP_X_FORWARDED_FOR'], // Cloudflare 转发客户端 IP
    'HTTP_CF_CONNECTING_IP' =>  $_SERVER['HTTP_CF_CONNECTING_IP'], // Cloudflare 转发客户端 IP
    'HTTP_CF_IPCOUNTRY'     =>  $_SERVER['HTTP_CF_IPCOUNTRY'], // Cloudflare 转发客户端 IP 所在国家
    'HTTP_CF_RAY'           =>  $_SERVER['HTTP_CF_RAY'], // Cloudflare 使用节点 ID
    'HTTP_CF_VISITOR'       =>  json_decode($_SERVER['HTTP_CF_VISITOR']), // Cloudflare 转发客户端使用协议
    'HTTP_CDN_LOOP'         =>  $_SERVER['HTTP_CDN_LOOP'], // Cloudflare 回源
    'REMOTE_ADDR'           =>  $_SERVER['REMOTE_ADDR'], // Cloudflare 回源所使用的 IP
];

header('content-type:application/json');
echo json_encode($data);
