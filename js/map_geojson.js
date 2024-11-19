window._AMapSecurityConfig = { securityJsCode: "7242ca1699a807f992d7be20b7536e11" };
var map = new AMap.Map("map", { zoom: 12, center: [120.418691, 30.901641]});
const range_of_time = document.getElementById('range_of_time');
let thejsondata;
let poijsondata;
var positions = [];
map.clearMap();
time_value = range_of_time.value + "分钟";
document.addEventListener('DOMContentLoaded', function ()
{ 
    fetch('json\\生活娱乐poi.geojson') // 读取 suzhoupoi.json 文件
    .then(response => {
        if (!response.ok) {
            throw new Error('网络响应错误: ' + response.status);
        }
        return response.json(); // 将响应转换为 JSON
    })
    .then(jsonData => {
        thejsondata = jsonData
        var data = jsonData["features"]
        data.forEach(lines => {
            var theline =  lines["geometry"]["coordinates"] // 获取geojson中的线数据
            var name = lines["properties"]["category"] // geojson的名称

            if (name == time_value){  // 判断是否是用户选择的时间
            var line_in_amap = [] // 储存高德API能读取的节点坐标数组
            theline.forEach(
                line => {
                    line.forEach(zuobiao => {
                        line_in_amap.push(new AMap.LngLat(zuobiao[0],zuobiao[1]))
                    });
                }
            )
            // 设置多边形参数
            var polygon = new AMap.Polygon({
                path: line_in_amap,
                fillcolor:"#66ccff"
            }); 
            // 鼠标移入事件
            polygon.on("mouseover",() =>{
                polygon.setOptions([
                    fillOpacity = 0.7,
                ])
            });
            // 鼠标移出事件
            polygon.on("mouseout",() =>{
                polygon.setOptions([
                    fillOpacity = 1,
                ])
            })

            map.add(polygon) // 添加多边形
            map.setFitView([polygon]) // 自动缩放地图


    fetch('json\\生活娱乐.json') // 读取 suzhoupoi.json 文件
    .then(response => {
        if (!response.ok) {
            throw new Error('网络响应错误: ' + response.status);
        }
        return response.json(); // 将响应转换为 JSON
    })
    .then(jsonData => {
        poijsondata=jsonData
        jsonData.forEach(function (point) {
            var poiPosition = new AMap.LngLat(point.longitude, point.latitude);

                if (polygon.contains(poiPosition)) {
                    var marker = new AMap.Marker({
                        position: [point.longitude, point.latitude],
                        title: point.title,
                        map: map
                    });

                    positions.push(poiPosition)//当前多边形内的poi点位

                    var infoWindow = new AMap.InfoWindow({
                        content: `<div>
                                    <h4>${point.title}</h4>
                                    <p>分类: ${point.category_name}</p>
                                  </div>`,
                        offset: new AMap.Pixel(0, -30)
                    });

                    marker.on('click', function () {
                        infoWindow.open(map, marker.getPosition());
                    });
                }
            });
    })
    .catch(error => {
        console.error('加载JSON数据时出错:', error);
    });




        }
        });
    })
    .catch(error => {
        console.error('加载JSON数据时出错:', error);
    });

    
    
});


function renewmap(){
    map.clearMap();
    time_value = range_of_time.value + "分钟";
    var data = thejsondata["features"]
    data.forEach(lines => {
        var theline =  lines["geometry"]["coordinates"] // 获取geojson中的线数据
        var name = lines["properties"]["category"] // geojson的名称

        if (name == time_value){  // 判断是否是用户选择的时间
        var line_in_amap = [] // 储存高德API能读取的节点坐标数组
        theline.forEach(
            line => {
                line.forEach(zuobiao => {
                    line_in_amap.push(new AMap.LngLat(zuobiao[0],zuobiao[1]))
                });
            }
        )
        // 设置多边形参数
        var polygon = new AMap.Polygon({
            path: line_in_amap,
            fillcolor:"#66ccff"
        }); 
        // 鼠标移入事件
        polygon.on("mouseover",() =>{
            polygon.setOptions([
                fillOpacity = 0.7,
            ])
        });
        // 鼠标移出事件
        polygon.on("mouseout",() =>{
            polygon.setOptions([
                fillOpacity = 1,
            ])
        })

        map.add(polygon) // 添加多边形
        map.setFitView([polygon]) // 自动缩放地图

        poijsondata.forEach(function (point) {
            var poiPosition = new AMap.LngLat(point.longitude, point.latitude);

                if (polygon.contains(poiPosition)) {
                    var marker = new AMap.Marker({
                        position: [point.longitude, point.latitude],
                        title: point.title,
                        map: map
                    });
                    positions.push(poiPosition)//当前多边形内的poi点位
                    var infoWindow = new AMap.InfoWindow({
                        content: `<div>
                                    <h4>${point.title}</h4>
                                    <p>分类: ${point.category_name}</p>
                                  </div>`,
                        offset: new AMap.Pixel(0, -30)
                    });

                    marker.on('click', function () {
                        infoWindow.open(map, marker.getPosition());
                    });
                }
            });
    }
    });
};
