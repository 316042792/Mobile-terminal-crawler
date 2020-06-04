var begin = dialogs.input("这次从第几(+1)家店开始爬？",2);
var end = dialogs.input("到第几(+1)家店停止？")
while(row(begin).findOne(20) == null){
    swipe(400,1000,400,500,50);
}
var jishujun = 0;
var namepath = "/storage/emulated/0/1meituan/name.txt";
files.createWithDirs(namepath);
var ratepath = "/storage/emulated/0/1meituan/rate.txt";
files.createWithDirs(ratepath);
var numpath = "/storage/emulated/0/1meituan/num.txt";
files.createWithDirs(numpath);
var pricepath = "/storage/emulated/0/1meituan/price.txt";
files.createWithDirs(pricepath);
var typepath = "/storage/emulated/0/1meituan/type.txt";
files.createWithDirs(typepath);
var addresspath = "/storage/emulated/0/1meituan/address.txt";
files.createWithDirs(addresspath);
var timepath = "/storage/emulated/0/1meituan/time.txt";
files.createWithDirs(timepath);
for(var s = begin;s < end + 1; s++)
{
    while(row(s).findOne(20) == null){
        swipe(400,1000,400,500,50);
    }
    //分别去除广告和信息不全的店铺
    if(row(s).findOne().childCount() == 1 || row(s).findOne().child(1).child(0).child(1).child(2).child(0).child(0).text() == "新街口"){
            end++;
            continue;
    }
    var name = row(s).findOne().child(1).child(0).child(1).child(0).child(0).child(0).text();//店铺名称
    var rate = row(s).findOne().child(1).child(0).child(1).child(1).child(1).text();//店铺评分
    var type = row(s).findOne().child(1).child(0).child(1).child(2).child(0).child(0).text();//店铺类型
    var evaluatepath = "/storage/emulated/0/1meituan/evaluates/" + name + ".txt";
    files.createWithDirs(evaluatepath);
    row(s).findOne().click();//进入店铺详情页
    sleep(2000)
    var num = id("food_poi_evaluate_count").findOne().text();
    var price = id("food_poi_average_price").findOne().text();
    var address = id("poi_address_text").findOne().text();
    if(depth(17).textMatches(".*:.*").findOne(50)) //用到了正则表达式匹配时间
    {
        var time = depth(17).textMatches(".*:.*").findOne().text();
    }
    else
    {
        var time = id("food_poi_business_state").findOne().text();
    }
    //点击查看更多爬取网友推荐菜
    while(text("查看更多").findOne(500) == null){
        scrollDown();
        sleep(800);
    }
    text("查看更多").findOne().click();
    sleep(1500);
    var commend = [];
    var like = [];
    //第一个推荐菜的布局不同，单独定义
    commend[0] = row(0).findOne().child(0).child(1).child(0).child(0).text();
    like[0] = row(0).findOne().child(0).child(1).child(1).child(1).child(1).text();
    files.append(evaluatepath,commend[0]+" 推荐数："+like[0]+"\n");
    for(var i = 1;i < 10;i++){
        if(row(i).findOne(1000) == null){
            scrollDown();
        }
        //推荐菜可能没有10道
        if(row(i).findOne(1000) == null){
            break;
        }
        commend[i] = row(i).findOne().child(1).child(0).child(0).text()
        like[i] = row(i).findOne().child(1).child(1).child(1).child(1).text();
        files.append(evaluatepath,commend[i]+" 推荐数："+like[i]+"#\n");
    }
    back(); 
    sleep(800);
    //开始爬取评价
    text("评价").findOne().parent().click();
    sleep(1000)
    textStartsWith("更多评价").findOne().click();
    sleep(2000)
    var evaluate = [];
    var date = [];
    //下滑预加载以提高爬取效率
    while(id("feed_item").findOne(50).row() < 1000 && text("查看更多无字评价").findOne(2) == null)
    {
        scrollDown(0);
    }
    while(id("feed_item").findOne(50).row() > 1)
    {
        swipe(400,500,400,1000,10)
        sleep(500)
    }
    if(row(1).findOne() == null)
    {
        scrollUp(0);
    }
    scrollUp(0);
    sleep(1000);
    //爬取评论内容与日期
    for(i = 1;i < 1001;i++){
        while(row(i).findOne(10) == null) 
        {
            swipe(400,1000,400,500,50)
        } 
        if(row(i).findOne().child(0).text() == "查看更多无字评价"){
            break;
        }
        sleep(10);
        evaluate[i-1] = row(i).findOne().child(1).text();
        date[i-1] = row(i).findOne().child(0).child(1).child(1).text();
        files.append(evaluatepath,date[i-1]+"$"+evaluate[i-1]+"@\n")
    }
    //存储店铺信息
    files.append(namepath,name+"@")
    sleep(20)
    files.append(ratepath,rate+"@")
    sleep(20)
    files.append(numpath,num+"@")
    sleep(20)
    files.append(pricepath,price+"@")
    sleep(20)
    files.append(typepath,type+"@")
    sleep(20)
    files.append(addresspath,address+"@")
    sleep(20)
    files.append(timepath,time+"@")
    sleep(20)
    back();
    sleep(300);
    back();
    sleep(300);
    jishujun ++;
}
alert("爬了"+jishujun+"家")
