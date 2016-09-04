var Index = Index || {};

Index = {
	subpages : ['html/history.html', 'html/search.html', 'html/account.html'],
    subpageIds : ['history', 'search', 'account'],
	subpage_style : {
		top: '50px',
		bottom: '50px'
	},
	subPageObj : [],
	activeTab : 'home',
	aniShow : {},

	initSubPage : function(){
		var me = this;
		var self = plus.webview.currentWebview();
		for (var i = 0; i < 3; i++) {
			var temp = {};
			var sub = plus.webview.create(me.subpages[i], me.subpageIds[i], me.subpage_style);
			me.subPageObj.push(sub);
			sub.hide();
			self.append(sub);
			
			if(i == 2){
				sub.onloaded = function(){
					me.initEvent();
				}
			}
		}
	},
	
	initEvent : function(){
		var me = this;
		
		$('.cService').on('tap',function(e){
			var url = 'http://f88.live800.com/live800/chatClient/chatbox.jsp?companyID=566686&configID=132403&jid=5379036822';
			plus.runtime.openURL(url);
		});
		
		//选项卡点击事件
		mui('.mui-bar-tab').on('tap', 'a', function(e) {
			var targetTab = this.getAttribute('href');
			if (targetTab == me.activeTab) {
				return;
			}
			
			if(targetTab == 'history'){
				me.subPageObj[0].evalJS('getAllHistory();');
			}else if(targetTab == 'search'){
				mui.fire(me.subPageObj[1],'initOrderList');
			}else if(targetTab == 'account'){
				mui.fire(me.subPageObj[2],'refreshBalance',{refresh:true});
			}
			
			//显示目标选项卡
			//若为iOS平台或非首次显示，则直接显示
			if(mui.os.ios||me.aniShow[targetTab]){
				plus.webview.show(targetTab);
			}else{
				//否则，使用fade-in动画，且保存变量
				var temp = {};
				temp[targetTab] = "true";
				mui.extend(me.aniShow,temp);
				plus.webview.show(targetTab,"fade-in",300);
			}
			//隐藏当前;
			plus.webview.hide(me.activeTab);
			//更改当前活跃的选项卡
			me.activeTab = targetTab;
		});
	}
};
