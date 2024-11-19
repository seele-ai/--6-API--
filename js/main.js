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
    var poidata
    d3.json('json/test.json',function(a){
        poidata = a


        document.getElementById("chart").innerHTML = 
        "参数已更新<br> 当前参数：<br> &emsp;等时圈时间：" + values["time_value"] + "min"
         + "<br>&emsp;POI: " + poidata["index"]
        + "<br>&emsp;data: " + positions.length

        /*读取数据后绘图
        svg = d3.select("#bar-chart").select("svg")
        svg.attr("class","firstsvg")

        var w = 200;
        var h = 100;
        
        var xscale = d3.scale.linear()
        .domain(poidata["pois"])
        .range([0,w])
        var yscale = d3.scale.linear()
        .domain(0,d3.max(poidata["pois"]))
        .range(h-20,45)

        var xAxis = d3.svg.axis.scale(xscale).orient("bottom")

        svg.select("g.xaxis").call(xAxis)
        .attr("transform",`translate(0, ${h-20})`)
        .selectAll("text")
        .attr("transform","rotate(-14)")



        var bars = svg.selectAll('rect.first_bar').data(poidata["pois"]);
        bars.exit().remove();

        bars.enter().append('rect').attr('class','city-bar');

        bars
        .attr("x",function(d){return xscale(d)-15})
        .attr("y",function(d){return yscale(d)-10})
        .attr("width",20)
        .attr("height",function(d){return h - yscale(d) - 10})*/


    });
}
