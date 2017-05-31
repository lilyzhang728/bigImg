(function($){
	var Zh_bigImg = function(select){
		var self = this;
		this.bigimage = select;
		this.width = select.width();
		this.height = select.height();
		this.pdiv = Math.floor(Math.random()*this.width*this.height);//保证各容器id不重复
		this.top = select.offset().top;
		this.left = select.offset().left;

		//默认参数设定
		this.setting={
			"pwidth"	: 	300,
			"pheight"	: 	200,
			"scale"		: 	3,
			"margin_top"	: 	0,
			"margin_left" 	: 	0,
			"pclass"		: ""
		}

		//调用对象的获取用户自定义参数的方法，并且将默认参数合并
		$.extend(this.setting,this.getSetting());
		//设置图片路径属性
		this.imgsrc = this.setting.bigImg?this.setting.bigImg:select.attr('src');

		this.bigimage.hover(function(){
			self.createPchild(self.pdiv);
			self.imgsrc=$(this).attr('src');
			self.createImg();
		},function(){
			var pdiv="#"+self.pdiv;
			$(pdiv).remove();
		});

		this.bigimage.mousemove(function(e){
			var scrollTop=$(document).scrollTop();
			var scaleX=(e.clientX-self.left)/self.width;
			var scaleY=(e.clientY-self.top+scrollTop)/self.height;
			self.updImg(scaleX,scaleY);
		});

	};

	//扩展已有对象的方法
	Zh_bigImg.prototype={
		//获取自定义参数
		getSetting:function(){
			var setting = this.bigimage.attr('setting');//这里的this指向Zh_bigImg的实例化对象
			if (setting && setting!="") {
				return $.parseJSON(setting);
			} else{
				return {};
			}
		},

		//在文档中创建了大图的盒子
		createPchild:function(id){
			var ele = document.createElement("div");
			var scrollTop = $(document).scrollTop();
			$("body").append($(ele));
			$(ele).attr({'id':id}).css({
				'width':this.setting.pwidth+"px",
				'height':this.setting.pheight+"px",
				'position':'fixed',
				'top':this.top+this.setting.margin_top-scrollTop,
				'left':this.left+this.width+this.setting.margin_left,
				'overflow':'hidden'
			}).addClass(this.setting.pclass);
		},

		//创建放大过的大图
		createImg:function(){
			var img = document.createElement("img");
			$(img).attr('src',this.imgsrc).css({
				'width':this.width*this.setting.scale,
				'height':this.height*this.setting.scale,
				'margin-top':'0px',
				'margin-left':'0px',
				'position':'relative'
			});
			var pdiv = "#"+this.pdiv;
			$(pdiv).append($(img));
		},

		//鼠标在图片上划过时更新大图位置
		updImg:function(scaleX,scaleY){
			var top = (scaleY*this.height*this.setting.scale)-(scaleY*this.setting.pheight);
			var left = (scaleX*this.width*this.setting.scale)-(scaleX*this.setting.pwidth);
			var pdiv="#"+this.pdiv;
			$(pdiv).find("img").css({'top':-top+"px"});
			$(pdiv).find("img").css({'left':-left+"px"});
		}
	};

	Zh_bigImg.init = function(select){
		var _this = this;
		//根据不同的容器实例化不同的插件对象
		select.each(function(){
			new _this($(this));
		});
	};

	window['Zh_bigImg']=Zh_bigImg;

})(jQuery);


//初始化插件
$(function(){
	window.Zh_bigImg.init($("img[bigImg='true']"));
})