$(function(){
	//active
	$('a','.templatemo-left-nav').click(function(evt){
		$(evt.target).addClass('active').parent().siblings().find('a').removeClass('active');
	})
	//隐藏
	$('i.fa.fa-times').click(function(){
		$(this).parent().slideUp(function(){
			// $(this).hide();
		});
	});
	$('i.fa.fa-gear').click(function(){
		$(this).toggleClass('i-active');
		$(this).parent().toggleClass('s-active');
		if($(this).hasClass('i-active')){
			$('.settings-pane').css("height","240px");
		}else{
			$('.settings-pane').css("height",0);
		}
	})
})

var App = angular.module('App',['commonApp']);

App.config(function($controllerProvider){
	App.register = {
		controller: $controllerProvider.register
	};
})

App.controller('Controller',['$scope','$http','$compile',function($scope, $http, $compile){
	//修改信息
	$scope.UserInfo = function(){
		$http.get('modify_info.html').success(function(response){
			$compile($('.templatemo-content-container').html(response))($scope);
		})
	};
	//用户列表
	$scope.Accounts = function(){
		localStorage.setItem("from", "users_list");
		$http.get('account.html').success(function(response){
			$compile($('.templatemo-content-container').html(response))($scope);
	    })
	};
	//产品列表
    $scope.Products = function(){
    	localStorage.setItem("from", "product_item");
    	$http.get("productslist.html").success(function(response){
	 		$compile($('.templatemo-content-container').html(response))($scope);
	    })
    };
    //购物车
    $scope.Cart = function(){
    	localStorage.setItem("from", "shop_cart");
    	$http.get("cart.html").success(function(response){
	 		$compile($('.templatemo-content-container').html(response))($scope);
	    })
    };
    //订单
    $scope.Orders = function(){
    	localStorage.setItem("from", "order_list");
    	$http.get("order.html").success(function(response){
	 	 	$compile($('.templatemo-content-container').html(response))($scope);
	    })
    };
    //地址
    $scope.Address = function(){
    	localStorage.setItem("from", "address_list");
    	$http.get("address.html").success(function(response){
	 	 	$compile($('.templatemo-content-container').html(response))($scope);
	    })
    };
    //退出登录
    $scope.loginOut = function(){
		$http.get('logout.php').success(function(){
			window.location.href = "login.html";
		})
	};
	//获取id
	$http.get('getsession.php').success(function(response){
		if(!response.state){
			window.location.href = "login.html";
		}else{
			$('.account').text(response.account);
		}
	})
}])