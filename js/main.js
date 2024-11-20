// 改变等时圈拖动条
function change_time() 
{
    const range_of_time = document.getElementById('range_of_time');
    time_value = range_of_time.value;
    document.getElementById("time_value").innerHTML = ("等时圈时间:" + time_value + "min");
}


// 获取用户选择的参数
function get_all_value()
{   
    const range_of_time = document.getElementById('range_of_time');
    time_value = range_of_time.value;
    values = {
        "time_value": time_value,
    };
    return values;
}


//更新图表
function update_chart(values)
{   
    document.getElementById("bar-chart").innerHTML = "&emsp;等时圈时间：" + values["time_value"] + "min"
    + "<br>&emsp;等时圈内poi数目: " + positions.length + '<svg id="poisvg"><g class="xaxis"></g><g class="yaxis"></g></svg>' 

    

};
