<?php
	include "DBHelper.php";

	$form = $_POST["form"];
	$objArr = $_POST['obj'];
	$objArr = json_decode($objArr);
	$flag = true;

	for($i=0; $i<count($objArr); $i++){
		if($form == "order_list"){
			$sql = "insert into order_list(order_id,account,phone,address,pro_id,store_id,order_img,title,price,count,integral,totalPrice,payway,invoice,notes,create_time,update_time,state) values (";
		}else if($form == "product_item"){
			$sql = "insert into product_item(id,store_id,main_img,title,price,inventory) values (";
		}else if($form == "shop_cart"){
			$sql = "insert into shop_cart(account,id,store_id,item_img,title,price,inventory,count) values (";
		}else if($form == "users_list"){
			$sql = "insert into users_list(account,password,phone,email,logo,level,nickName,provine,city,area,address,registerTime,lastLoginTime) values (";
		}
		
		for($j=0; $j<count($objArr[$i]); $j++){
			$sql = $sql."'".$objArr[$i][$j]."',";
		}
		$sql = $sql.")";
		$sql = explode(",)",$sql)[0];
		$sql = $sql.");";
		
		$result = excute($sql);
		
		if (!$result) {
			$flag = false;
		}
	}
	if ($flag) {
		echo '{"state": true, "msg": "success !!"}';
	}else{
		echo '{"state": false, "msg": "fail !!"}';
	}
?>