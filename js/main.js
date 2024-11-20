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
    selected_positions = positions.sort(function(a,b){
        return  b["checkin_user_num"] - a["checkin_user_num"] // 按签到数排序
    }).slice(0,10) // 切片
    
    selected_positions.forEach(a => 
    {
        const marker = new AMap.Marker({
            position: [a.longitude, a.latitude],
            title: a.title,
            icon: "//vdata.amap.com/icons/b18/1/2.png",
            map: map
        }); // 筛选后的点标记

        const infoWindow = new AMap.InfoWindow({
            content: `<div>
                        <h4 class="windowh4">${a.title}</h4>
                        <p>该POI签到数: ${a.checkin_user_num}</p>
                        <button type="button" class="poi_button" id="${a.title}"> 规划路径 </button>
                      </div>`,
            offset: new AMap.Pixel(0, -30)
        }); // 筛选后的框
        
        marker.on('click', () => {
            infoWindow.open(map, marker.getPosition());

            const button = document.getElementById(`${a.title}`)
            button.addEventListener("click", updateButton);
        });

        function updateButton(){
            console.log(a.latitude)
            console.log(a.longitude) // 这里调用路径规划API
        }
    });

};
