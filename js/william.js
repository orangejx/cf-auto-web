
/*!
 * CF-Auto-WEB v0.0.1 (https://cf-auto.0jn.net)
 * Copyright 2021 The CF-Auto-WEB Authors
 * Copyright 2021 William(Aldrich J. Xing https://kidding.pub)
 * Licensed under MIT (https://github.com/orangejx/cf-auto-web/blob/master/LICENSE)
 */

// 公共变量
let domain      =   'cf-auto.0jn.net'; // 域名
let url         =   'https://'+domain+'/'; // URL
let trace       =   '/cdn-cgi/trace'; // 当前 CDN Trace 数据
let info        =   'info.php'; // 当前请求数据
let node        =   'node.json'; // CDN 节点数据
let arrTrace    =   ['colo','fl','gateway','h','http','ip','loc','sni','tls','ts','uag','visit_scheme','warp']; // Trace 包含信息
let arrTrAlive  =   ['colo','h','http','ip','loc','tls','uag','visit_scheme','warp']; // 使用的 Trace 信息
let arrInfo     =   ['HTTP_CDN_LOOP','HTTP_CF_CONNECTING_IP','HTTP_CF_IPCOUNTRY','HTTP_CF_RAY','HTTP_CF_VISITOR','HTTP_X_FORWARDED_FOR']; // 请求返回数据
let nsType      =   {'1':'A','2':'NS','5':'CNAME','6':'SOA','16':'TXT','28':'AAAA'}; // NS 类型

function getNode() {
    // 获取 Cloudflare CDN 节点信息
    $.ajax({
        url: node,
        type: 'get',
        data: null,
        cache:false,
        async:false,
        success:function(result){
            $('#cdn-data').data('cdn-node',result)
        }
    })
}

function getInfo() {
    // 查询当前请求信息
    $.ajax({
        url: info,
        type: 'get',
        data: null,
        cache:false,
        async:false,
        success:function(result){
            $('#cdn-data').data('cdn-info',result)
        }
    })
}

function getTrace(){
    // 查询当前 CDN 节点 Trace 信息
    let resArrN =   new Array();
    $.ajax({
        url: trace,
        type: 'get',
        data: null,
        cache:false,
        async:false,
        success:function(result){
            let resArr  =   result.split(/[\r\n]+/);
            // resArr.forEach((item,index)=>{
            //     if(!item)
            //         resArr.splice(index,1); //删除空项
            // })
            resArr.forEach((item,index)=>{
                let tmp_item = item.split('=');
                if (tmp_item.length == 2)
                    resArrN[tmp_item[0]]    =   tmp_item[1];
            })
        }
    })
    $('#cdn-data').data('cdn-cgi-trace',resArrN)
    $.each(arrTrace,function (key,value) {
        if ($('#cdn-data').data('cdn-cgi-trace')[value] == null || $('#cdn-data').data('cdn-cgi-trace')[value] == undefined)
            $('#cdn-data').data('cdn-cgi-trace')[value] = '获取失败~';
    })
    getNode();
    $.each($('#cdn-data').data('cdn-node'),function (key,item) {
        if (item[$('#cdn-data').data('cdn-cgi-trace')['colo']] != undefined && item[$('#cdn-data').data('cdn-cgi-trace')['colo']] != null && item[$('#cdn-data').data('cdn-cgi-trace')['colo']] != ''){
            $('#cdn-data').data('cdn-cgi-trace')['colo'] = item[$('#cdn-data').data('cdn-cgi-trace')['colo']] + ' - ' + key;
            return false; // 相当于 break
        }
    })

}

function setTrace() {
    getTrace();
    setTimeout(function () {
        $.each(arrTrAlive,function (key,value) {
            $('.trace-'+value).text($('#cdn-data').data('cdn-cgi-trace')[value]);
        })
        $(".refresh-cdn-cgi-trace svg").removeClass('refresh-click');
    },200)
}

function getDNS() {
    // 查询 A 记录
    $.ajax({
        url: 'https://dns.alidns.com/resolve?name='+domain+'&type=1',
        type: 'get',
        data: null,
        cache:false,
        async:false,
        success:function(result){
            $('#cdn-data').data('cdn-dns',[]);
            if (result['Answer'] != undefined && result['Answer'].length != undefined && result['Answer'].length > 0)
                $('#cdn-data').data('cdn-dns',result['Answer']);
        }
    })
    let cDNS =  [];
    $.each($('#cdn-data').data('cdn-dns'),function (key,item) {
        cDNS[key] = item;
        if (item['type'] != undefined && nsType[item['type']] != undefined)
            cDNS[key]['type']   =   nsType[item['type']];
    })
    $('#cdn-data').data('c-dns',cDNS);
}

function setDNS() {
    getDNS();
    setTimeout(function () {
        if ($('#cdn-data').data('c-dns').length < 1){
            $(".tbody-cdn-dns").html('<tr><td>暂未获取到结果~</td></tr>');
        }else {
            let arrText = doT.template($("#tpl-cdn-dns").text());
            $(".tbody-cdn-dns").html(arrText($('#cdn-data').data('c-dns')));
        }
        $(".refresh-cdn-dns svg").removeClass('refresh-click');
    },100)
}

function getDNS6() {
    // 查询 AAAA 记录
    $.ajax({
        url: 'https://dns.alidns.com/resolve?name='+domain+'&type=28',
        type: 'get',
        data: null,
        cache:false,
        async:false,
        success:function(result){
            $('#cdn-data').data('cdn-dns6',[]);
            if (result['Answer'] != undefined && result['Answer'].length != undefined && result['Answer'].length > 0)
                $('#cdn-data').data('cdn-dns6',result['Answer']);
        }
    })
    let cDNS6 =  [];
    $.each($('#cdn-data').data('cdn-dns6'),function (key,item) {
        cDNS6[key] = item;
        if (item['type'] != undefined && nsType[item['type']] != undefined)
            cDNS6[key]['type']   =   nsType[item['type']];
    })
    $('#cdn-data').data('c-dns6',cDNS6);
}

function setDNS6() {
    getDNS6();
    setTimeout(function () {
        if ($('#cdn-data').data('c-dns6').length < 1){
            $(".tbody-cdn-dns6").html('<tr><td>暂未获取到结果~</td></tr>');
        }else {
            let arrText = doT.template($("#tpl-cdn-dns").text());
            $(".tbody-cdn-dns6").html(arrText($('#cdn-data').data('c-dns6')));
        }
        $(".refresh-cdn-dns6 svg").removeClass('refresh-click');
    },100)
}

function start() {
    $(".refresh-cdn-dns svg").click();
    $(".refresh-cdn-dns6 svg").click();
    $(".refresh-cdn-cgi-trace svg").click();
}

$(function (){
    $(".refresh-cdn-dns svg").click(function () {
        $(this).addClass("refresh-click");
        $(".tbody-cdn-dns").html('<tr><td>获取ing...</td></tr>');
        setDNS();
    })
    $(".refresh-cdn-dns6 svg").click(function () {
        $(this).addClass("refresh-click");
        $(".tbody-cdn-dns6").html('<tr><td>获取ing...</td></tr>');
        setDNS6();
    })
    $(".refresh-cdn-cgi-trace svg").click(function () {
        $(this).addClass("refresh-click");
        $.each(arrTrAlive,function (key,value) {
            $('.trace-'+value).text('获取ing...');
        })
        setTrace();
    })
    start();
})
