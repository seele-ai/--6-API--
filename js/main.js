// 改变等时圈拖动条
function change_time() 
{
    const range_of_time = document.getElementById('range_of_time');
    time_value = range_of_time.value;
    document.getElementById("time_value").innerHTML = ("您改变了一下时间:" + time_value + "min");
    update_charm(get_all_value());
}

// 改变微博范围
function change_weibo()  
{
    const selection = document.getElementById("select_of_weibo");
    weibo = selection.value;
    document.getElementById("weibo_range").innerHTML = ("您改变了范围" + weibo);
    update_charm(get_all_value());
}



// 获取用户选择的参数
function get_all_value()
{   
    const range_of_time = document.getElementById('range_of_time');
    time_value = range_of_time.value;
    const selection = document.getElementById("select_of_weibo");
    weibo = selection.value;
    values = {
        "time_value": time_value,
        "weibo":weibo
    };
    return values;
}


//更新图表
function update_charm(values)
{
    document.getElementById("charm").innerHTML = 
    ("参数已更新<br> 当前参数：<br> &emsp;等时圈时间：" + values["time_value"] + "min"
        + "<br>&emsp;微博范围： " + values["weibo"]
    );
}
