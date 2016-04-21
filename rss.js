/* global $ */

var feedsMap = {
    'Top Stories': 'Top%20Stories',
    'US': 'us+news',
    'Technology' : 'Technology+News'
}

var feeds = ['Top Stories', 'US', 'Technology'];

var loadSideMenu = function(){
    
    var menu = $("#sidebar");
    
    for (var i = 0; i < feeds.length; i++ ) {
        menu.append("<li><a href='#' onClick='loadFeed(&quot;" + feeds[i] +"&quot;)'>" + feeds[i] +"</a></li>");
    }
}


loadSideMenu();

var renderView = function(items){
    
    var view = $("#rssListView");
    view.empty();
    
    for( var i = 0 ; i < items.length ; i++ ){

        var item = items[i];

        console.log(item);
        var html = 
        `
        <div class="row">
            <div class="itemCard">
                <div class="col s2 offset-s1" style="{{style}}"></div>
                <div class="col s9">
                    <span class="itemTitle">{{title}}</span>
                    <p class="itemDescription">{{description}}</p>
                </div>
            </div>
        </div>
        
        `
        html = html.replace("{{title}}", item.title );
        html = html.replace("{{description}}", item.description );

        if( item.Image ){
            html = html.replace("{{style}}", "min-width:100px;height:100px;background-image:url('"+ item.Image.content +"');background-size:cover");
        }
        else{
            html = html.replace("{{image}}", "min-width:100px;height:100px;background-color:red;");            
        }
        view.append(html); 

    }
    
    
}



var loadFeed = function(feedName){

    var view = $("#rssListView");
    view.empty();
    
    $("#rssTitle").html(feedName);

    var q = feedsMap[feedName];
    
    var url = 'https://www.bing.com/news?q=' + q  + '&format=RSS';
    
    console.log(url);
    
    
    /*
    *  use Yahoo YQL to convert RSS to JSON
    */
    var YQLstr = 'SELECT channel.item FROM feednormalizer WHERE output="rss_2.0" AND url ="' + url  + '" LIMIT ' + '100';

    var itemList = [];

    $.ajax({
        url: "https://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(YQLstr) + "&format=json&diagnostics=false&callback=?",
        dataType: "json",
        success: function (data) {
            if (!(data.query.results.rss instanceof Array)) {
                data.query.results.rss = [data.query.results.rss];
            }
            $.each(data.query.results.rss, function (e, itm) {
                
                itemList.push(itm.channel.item);
            });
        
            renderView(itemList);
            
        }
    });
    
}