window._AMapSecurityConfig = { securityJsCode: "7242ca1699a807f992d7be20b7536e11" };
var map = new AMap.Map("map", { zoom: 12, center: [120.614176, 31.318072]});

// 获取DOM元素
const range_of_time = document.getElementById('range_of_time');
const poi_type_select = document.getElementById('poi_type');
const travel_mode_select = document.getElementById('travel_mode');
const reset_checkbox = document.getElementById('reset_checkbox'); // 添加复选框
let thejsondata;

let poijsondata;
var positions = [];

// 更新地图函数
function updateMap() {
    // 获取当前选项
    const poiType = poi_type_select.value;
    const travelMode = travel_mode_select.value;
    const timeValue = range_of_time.value + "分钟";  // 获取时间值
    const resetChecked = reset_checkbox.checked; // 获取复选框状态

    // 清空地图
    map.clearMap();

    // 拼接GeoJSON文件路径
    const geojsonPath = `json/${travelMode}_${poiType}.geojson`;

    // 加载对应的GeoJSON数据
    fetch(geojsonPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应错误: ' + response.status);
            }
            return response.json();
        })
        .then(jsonData => {
            thejsondata = jsonData;
            const data = jsonData["features"];

            // 遍历GeoJSON数据，根据时间选择显示对应的多边形
            data.forEach(lines => {
                const theline = lines["geometry"]["coordinates"]; // 获取线数据
                const name = lines["properties"]["category"]; // 获取类别
                const timeValueInt = parseInt(name.replace("分钟", "")) || 99; // 提取时间值

                if (resetChecked || name === timeValue) {  // 判断是否为选中的时间
                    const line_in_amap = [];  // 存储高德地图的节点坐标数组
                    theline.forEach(line => {
                        line.forEach(coord => {
                            line_in_amap.push(new AMap.LngLat(coord[0], coord[1]));
                        });
                    });

                    // 设置多边形参数
                    const polygon = new AMap.Polygon({
                        path: line_in_amap,
                        fillColor: "#66ccff",
                        fillOpacity: 0.5,
                        strokeColor: "#0000ff",
                        strokeWeight: 1,
                        zIndex: 100 - timeValueInt, // 时间小的 zIndex 大，显示在上层
                    });

                    // 鼠标事件
                    polygon.on("mouseover", () => {
                        polygon.setOptions({ fillOpacity: 0.7 });
                    });
                    polygon.on("mouseout", () => {
                        polygon.setOptions({ fillOpacity: 0.5 });
                    });

                    // 添加到地图
                    map.add(polygon);

                    // 加载 POI 数据并筛选
                    fetch('json/生活娱乐.json')
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('网络响应错误: ' + response.status);
                            }
                            return response.json();
                        })
                        .then(poiData => {
                            poijsondata = poiData;
                            positions = [];
                            poiData.forEach(point => {
                                const poiPosition = new AMap.LngLat(point.longitude, point.latitude);

                                if (polygon.contains(poiPosition)) {
                                    const marker = new AMap.Marker({
                                        position: [point.longitude, point.latitude],
                                        title: point.title,
                                        map: map
                                    });

                                    positions.push(point); // 当前多边形内的 POI 点位

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
                                }
                            });
                        })
                        .catch(error => {
                            console.error('加载POI数据时出错:', error);
                        });
                }
            });

            // 自动缩放地图以适应多边形
            map.setFitView();
        })
        .catch(error => {
            console.error('加载JSON数据时出错:', error);
        });
}

// 监听选项变化，触发地图更新
poi_type_select.addEventListener('change', updateMap);
travel_mode_select.addEventListener('change', updateMap);
range_of_time.addEventListener('change', updateMap);
reset_checkbox.addEventListener('change', updateMap); // 监听“重置”复选框变化

// 初次加载地图
document.addEventListener('DOMContentLoaded', updateMap);
