
window._AMapSecurityConfig = { securityJsCode: "7242ca1699a807f992d7be20b7536e11" };

document.addEventListener('DOMContentLoaded', function ()
{

    var map = new AMap.Map("map", { zoom: 12, center: [120.418691, 30.901641]});
    


    fetch('json\\suzhoupoi.json') // 读取 suzhoupoi.json 文件
    .then(response => {
        if (!response.ok) {
            throw new Error('网络响应错误: ' + response.status);
        }
        return response.json(); // 将响应转换为 JSON
    })
    .then(jsonData => {
        jsonData.forEach(function (point) {
            var marker = new AMap.Marker({
                position: [point.longitude, point.latitude],
                title: point.title,
                map: map
            });

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
        });
    })
    .catch(error => {
        console.error('加载JSON数据时出错:', error);
    });


});

