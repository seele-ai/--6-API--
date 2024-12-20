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
    document.getElementById("poi_index").innerHTML = ""
    document.getElementById("bar-chart").innerHTML = "&emsp;等时圈时间：" + values["time_value"] + "min"
    + "<br>&emsp;等时圈内poi数目: " + positions.length + '<div id="way"></div>' 
    selected_positions = positions.sort(function(a,b){
        return  b["checkin_user_num"] - a["checkin_user_num"] // 按签到数排序
    }).slice(0,10) // 切片
    
    other_positions = positions.sort(function(a,b){
        return  b["checkin_user_num"] - a["checkin_user_num"]
    }).slice(10,) // 切片


    tablehead =  "<table border='1'><thead><tr><th>POI名称</th><th>打卡数</th><th>前往此处</th></tr></thead><tbody>" // 表头

    // 根据前10个的Poi更新其icon与列表
    selected_positions.forEach(a => 
    {   
        tablehead +=`<tr>
        <td>${a.title}</td>
        <td>${a.checkin_user_num}</td>
        <td><button type="button" class="poi_button" id="table_${a.title}"> 前往此处 </button></td>
        </tr>`

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
                        <button type="button" class="poi_button" id="${a.title}"> 前往此处 </button>
                      </div>`,
            offset: new AMap.Pixel(11, 2)
        }); // 筛选后的框
        
        marker.on('click', () => {
            infoWindow.open(map, marker.getPosition());

            const button = document.getElementById(`${a.title}`)
            button.addEventListener("click", updateButton);
        });

        function updateButton(){
            map.clearMap();
            load_way(a.latitude,a.longitude)
        }
    });

    // 其余POI的显示
    other_positions.forEach(point => 
        {   
            const marker = new AMap.Marker({
                position: [point.longitude, point.latitude],
                title: point.title,
                map: map
            });

            const infoWindow = new AMap.InfoWindow({
                content: `<div>
                            <h4>${point.title}</h4>
                            <p>分类: ${point.category_name}</p>
                          </div>`,
                offset: new AMap.Pixel(0, -30)
            });

            marker.on('click', () => {
                infoWindow.open(map, marker.getPosition());
            });
        })






    document.getElementById("way").innerHTML += tablehead + "</tbody>" // 表格结尾

    // 为表格中的按钮添加函数
    selected_positions.forEach(a => 
        {   
            const button = document.getElementById(`table_${a.title}`)
            button.addEventListener("click", updateButton);
            function updateButton(){
                map.clearMap();
                load_way(a.latitude,a.longitude)
            }
        })
};


function load_way(lat,lon){
    document.getElementById("bar-chart").innerHTML = "路径规划结果如下：<div id='way'></div>" 
    document.getElementById("poi_index").innerHTML = "" 
    endlnglat = [lon,lat] //终点
    startlnglat = [120.629211,31.324194] //起点

    const travel_mode_select = document.getElementById('travel_mode'); // 交通方式
    mode = travel_mode_select.value
    if(mode == "驾车"){
        driving.clear();
        riding.clear();
        driving.search(startlnglat,endlnglat,function (status, result){
            document.getElementById("poi_index").innerHTML+=`预计用时：${(result.routes[0].time/60).toFixed(2)}min`
        })
    }else{
        driving.clear();
        riding.clear();
        riding.search(startlnglat,endlnglat,function (status, result){
            document.getElementById("poi_index").innerHTML+=`预计用时：${(result.routes[0].time/60).toFixed(2)}min`
        })
    }
}

var driving = new AMap.Driving({
    policy:0,
    map:map,
    panel:"way"
}); //驾车插件

var riding = new AMap.Riding({
    policy:0,
    map:map,
    panel:"way"
}); //骑行插件
