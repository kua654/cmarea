+(function($){
	$.fn.cmArea = function (options,selectBack){
		if(this.length == 0) return this;
        if(this.length > 1){
            this.each(function(){$(this).cmArea(options,selectBack)});
            return this;
        }
        var _this=$(this),isinput=true;
		if(_this.is('input')){
			_this.prop('readonly', true).on('mousedown.dw', function (ev) {
				ev.preventDefault();
			});
		}else{
			isinput=false;	
		}
        var def= {
            zone:true,  //是否选择区
			full:false  //是否显示完整地区
        };
		var opts=$.extend(def, options);
		var rhtml = '';
		rhtml += '<div class="iarea-hold">'+
					'<div class="iarea-choose c-hide">'+
						'<div class="iarea-top"><a href="javascript:;" class="iarea-cancel">取消</a>所在省市</div>'+
						'<div class="iarea-sel">'+
							'<a href="javascript:;" class="curr">请选择</a>'+
						'</div>'+
						'<div class="iarea-box">'+
							'<div class="preiarea">'+
								'<span class="local-loading"></span>'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="iarea-choose-mb c-hide"></div>'+
				'</div>';
		_this.on('click',function(){
			$('input,textarea,select').blur();
			$('.iarea-hold').remove();
			$('body').append(rhtml);
			$('.iarea-choose-mb').fadeIn(200);
			$('.iarea-choose').removeClass('c-hide');
			$.getScript('//f1.yihuimg.com/TFS/upfile/YIHUIT_UTIL/province.js?V=20170101',function(){
				var provincejson = provinceData;
				var province = '<ul class="province-ul">';
				for( var i = 1; i < provincejson.length; i++){
					province += '<li data-val='+provincejson[i].provincename+' data-code='+provincejson[i].provinceid+'>'+provincejson[i].provincename+'</li>';
				}
				province += '</ul>';
				$('.iarea-box').find('.preiarea:eq(0)').html(province);
				
				$('.province-ul li').unbind('click').click(function () {  //选择省
					var pcode = $(this).attr('data-code'),
						pname = $(this).attr('data-val');
					$(this).addClass('curr').siblings().removeClass('curr');
					$('.iarea-box').find('.preiarea:gt(0)').remove();
					$('.iarea-sel').find('a:gt(0)').remove();
					$('.iarea-box').append('<div class="preiarea"><span class="local-loading"></span></div>');
					$('.iarea-sel').find('a:eq(0)').html(pname).attr('data-code',pcode).removeClass('curr');
					$('.iarea-sel').append('<a href="javascript:;" class="curr">请选择</a>');
					$.getScript('//f1.yihuimg.com/TFS/upfile/YIHUIT_UTIL/city.js?V=20170101',function(){
						var cityjson = cityData;
						cityjson = cityjson[pcode];
						var city = '<ul class="city-ul">';
						for (var j = 1; j < cityjson.length; j++) {
							city += '<li data-val='+cityjson[j].cityname+' data-code='+cityjson[j].cityid+'>'+cityjson[j].cityname+'</li>';
						}
						city += '</ul>';
						$('.iarea-box').find('.preiarea:eq(1)').html(city);
						
						$('.city-ul li').unbind('click').click(function () {  //选择市
							var ccode = $(this).attr('data-code'),
								cname = $(this).attr('data-val');
							if(opts.zone){
								$.getScript('//f1.yihuimg.com/TFS/upfile/YIHUIT_UTIL/area.js?V=20170101',function(){
									var areajson = _areaData;
									areajson = areajson[ccode];
									if(areajson.length > 0){
										$(this).addClass('curr').siblings().removeClass('curr');
										$('.iarea-box').find('.preiarea:gt(1)').remove();
										$('.iarea-sel').find('a:gt(1)').remove();
										$('.iarea-box').append('<div class="preiarea"><span class="local-loading"></span></div>');
										$('.iarea-sel').find('a:eq(1)').html(cname).attr('data-code',ccode).removeClass('curr');
										$('.iarea-sel').append('<a href="javascript:;" class="curr">请选择</a>');
										var zone = '<ul class="zone-ul">';
										for (var k = 0; k < areajson.length; k++) {
											zone += '<li data-val='+areajson[k].n+' data-code='+areajson[k].id+'>'+areajson[k].n+'</li>';
										}
										zone += '</ul>';
										$('.iarea-box').find('.preiarea:eq(2)').html(zone);
										
										$('.zone-ul li').unbind('click').click(function () {  //选择区
											var zcode = $(this).attr('data-code'),
												zname = $(this).attr('data-val');
											iareaResult(zcode,zname);
										});
									}else{
										iareaResult(ccode,cname);
									}
								});	
							}else{
								iareaResult(ccode,cname);	
							}
						});
					});
				});
				
				$('.iarea-hold').on('click','.iarea-sel a',function(){
					$(this).addClass('curr').siblings().removeClass('curr');
					$('.preiarea').hide();
					$('.iarea-box').find('.preiarea').eq($(this).index()).show();
				});
				
				$('.iarea-hold').on('click','.iarea-choose-mb,.iarea-cancel',function(){
					$('.iarea-hold').remove();
				});
			});
		});
		
		function iareaResult(code,name){
			var il = $('.iarea-sel a').length,
				rcode = code,
				rname = name,
				frname = name;
			for(var x = il - 2; x >= 0; x--){
				rcode = $('.iarea-sel a').eq(x).attr('data-code') + ',' + rcode;
				rname = $('.iarea-sel a').eq(x).text() + ',' + rname;
				frname = $('.iarea-sel a').eq(x).text() + ' ' + frname;
			}
			$('.iarea-hold').remove();
			if(opts.full){
				if(isinput){
					_this.val(frname).attr('data-code',rcode).attr('data-val',rname);
				}else{
					_this.html(frname).attr('data-code',rcode).attr('data-val',rname);
				}
			}else{
				if(isinput){
					_this.val(name).attr('data-code',rcode).attr('data-val',rname);
				}else{
					_this.html(name).attr('data-code',rcode).attr('data-val',rname);
				}
			}
			if(selectBack){
				selectBack(rcode,rname);
			}
		}
	}
})(jQuery);