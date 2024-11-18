# -*- coding: utf-8 -*-
# @Author: Xie 
# @Date:   2021-04-15 11:49:25
# @Last Modified by:   Xie 
# @Last Modified time: 2021-04-15 11:58:10


import requests
import json
import csv
import time

from shapely.geometry import Point, Polygon, mapping
from shapely.ops import unary_union
from geojson import Feature, FeatureCollection, dump

starttime=time.asctime(time.localtime(time.time()))   
starttime1=time.time();
# 调用百度API进行两点之间的路径查询
def getjson(ocoo,dcoo):
    # 先纬度后经度
    url='http://api.map.baidu.com/direction/v2/driving?origin='+ocoo+'&destination='+dcoo+'&coord_type=wgs84&departure_time=1595548800&tactics_incity=4&ak=IGaSHYRlV4uakbwFqKWUTlGGx7jXhbP0'
    while True:
        try:
            response=requests.get(url=url,timeout=5)
            break
        except requests.exceptions.ConnectionError:
            print ('ConnectionError -- please wait 3 sec')
            time.sleep(3)
        except requests.exceptions.ChunkedEncodingError:
            print ('ChunkedEncodingError -- please wait 3 sec')
            time.sleep(3)
        except:
            print ('Unknow error')
            time.sleep(3)
    html=response.text
    decodejson=json.loads(html)
    return decodejson
# 输入查询文件的路径
file_object=open(r'D:/大三上/网络基础与WebGIS/小组作业/poi.csv','r', encoding='gbk')
# 输入结果文件的保存路径
file_object2=open(r'D:/大三上/网络基础与WebGIS/小组作业/poi_output.csv','w', encoding='utf-8')
csv_reader = csv.reader(file_object)
csv_writer = csv.writer(file_object2)


# 分类存储点
points_5min = []
points_10min = []
points_15min = []
points_20min = []
points_25min = []
points_30min = []
points_30min_above = []


# 写入CSV文件的表头
csv_writer.writerow(['id', 'start_latitude', 'start_longitude', 'duration (minutes)', 'distance (km)', 'category'])
count=0
try:
    for spline in csv_reader:
        count=count+1
        # spline=line.split(',')
        idn=spline[0]
        start_latitude = spline[6].strip()
        start_longitude = spline[7].strip()
        coor = start_longitude + ',' + start_latitude
        door=spline[11].strip()+','+spline[10].strip()
        #print coor
        decodejson=getjson(coor,door)
        if decodejson.get('status')==0:#表示运行成功
            result=decodejson.get('result')
            routes=result.get('routes')
            #获得需要的时间和距离
            if len(routes)>0:     
                time2 = routes[0].get('duration') / 60  # 将时间转换为分钟
                distance = routes[0].get('distance') / 1000  # 将距离转换为公里
                # 分类
                if time2 <= 5:
                    category = '5分钟'
                    points_5min.append(Point(start_longitude, start_latitude))
                if time2 <= 10:
                    category = '10分钟'
                    points_10min.append(Point(start_longitude, start_latitude))
                if time2 <= 15:
                    category = '15分钟'
                    points_15min.append(Point(start_longitude, start_latitude))
                if time2 <= 20:
                    category = '20分钟'
                    points_20min.append(Point(start_longitude, start_latitude))
                if time2 <= 25:
                    category = '25分钟'
                    points_25min.append(Point(start_longitude, start_latitude))
                if time2 <= 30:
                    category = '30分钟'
                    points_30min.append(Point(start_longitude, start_latitude))
                else:
                    category = '30分钟以上'
                    points_30min_above.append(Point(start_longitude, start_latitude))
                
                csv_writer.writerow([idn, start_latitude, start_longitude, time2, distance, category])

                if count%10==0:
                    finishtime=time.asctime( time.localtime(time.time()))
                    finishtime1=time.time()
                    print (count)
                    print ('duration:',(finishtime1-starttime1)/60.0,'mins')
        else:
            print (str(coor)+','+ str(decodejson.get('status'))+decodejson.get('message'))
finally:
    file_object.close()
    file_object2.close()
    print ('finish')

def create_convex_hull(points):
    if points:
        return unary_union(points).convex_hull
    return None


hull_5min = create_convex_hull(points_5min)
hull_10min = create_convex_hull(points_10min)
hull_15min = create_convex_hull(points_15min)
hull_20min = create_convex_hull(points_20min)
hull_25min = create_convex_hull(points_25min)
hull_30min = create_convex_hull(points_30min)
hull_30min_above = create_convex_hull(points_30min_above)



# 创建 GeoJSON 特征
features = []

layers = {
    "5分钟": hull_5min,
    "10分钟": hull_10min,
    "15分钟": hull_15min,
    "20分钟": hull_20min,
    "25分钟": hull_25min,
    "30分钟": hull_30min,
    "30分钟以上": hull_30min_above
}

for category, hull in layers.items():
    if hull:
        feature = Feature(geometry=mapping(hull), properties={"category": category})
        features.append(feature)

feature_collection = FeatureCollection(features)
file_path = 'D:/大三上/网络基础与WebGIS/小组作业/poi.geojson'
with open(file_path, 'w', encoding='utf-8') as f:
    dump(feature_collection, f, ensure_ascii=False)
print(f"GeoJSON 文件已生成: {file_path}")
