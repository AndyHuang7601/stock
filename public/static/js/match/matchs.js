var matchs = new Vue({
    el: "#matchs",
    data: {
        cache_t: 600000,//毫秒
        matchList: []//赛场
    },
    methods: {
        join_match: function(e){
            var id = e.currentTarget.id;
            var url = e.currentTarget.attributes["href-url"].nodeValue;
            var uid = 49125;
            $.post(api_host + '/match/join',{id: id, uid: uid},function(data){
                if(data.status == 'success'){
                    window.location.href = url;
                }else{
                    alert(data.data);
                }     
            }, 'json');
        },
        updateMatchs(){
            var timestamp = new Date().getTime();
            var data = localStorage.getItem('matchList');
            data = JSON.parse(data);
            if(data == null || data.timestamp < timestamp){                
                var _this = this;
                $.getJSON(api_host + '/match/index',{},function(data){
                    if(data.status == 'success'){
                        var ret = data.data;
                        var matchList = [];
                        for (var i = 0; i < ret.length; i++) {
                            matchList.push({
                                name: ret[i].name,
                                image: ret[i].image,
                                id: ret[i].id,
                                start_date: ret[i].start_date,
                                joined: typeof(ret[i].joined) == 'undefined' ? 0 : ret[i].joined,
                                ranking: typeof(ret[i].ranking) == 'undefined' ? 0 : ret[i].ranking,
                                end_date: ret[i].end_date,
                                status: ret[i].status,
                                status_name: ret[i].status_name
                            });
                        }

                        localStorage.setItem('matchList',JSON.stringify({timestamp: new Date().getTime() + _this.cache_t, data: matchList}));
                        _this.matchList = matchList;
                    }    
                });
            } else {
                this.matchList = data.data;
            } 
        } 
    },
    created(){
        this.updateMatchs();
    }
});
