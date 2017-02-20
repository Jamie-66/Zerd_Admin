<?php
	include "DBHelper.php";

	// $state = $_POST['state'];

	// if($state == 0){
		$sql = "select * from order_list where 1;";
	// }else{
	// 	$sql = "select * from order_list where state='$state';";
	// }

	$array = query($sql);
	$size = count($array);
	if($size > 0){
		$arr = array();  
		for ($i = 0; $i < $size; $i++) { 
			$arr[] = $array[$i];
		}   
		$result = array(  
		    'data' => $arr
		);  
		echo json_encode($result);
	}else{
		if($state == 0){
			echo '{"state": "'. $state .'", "msg": "没有订单"}';
		}else if($state == 1){
			echo '{"state": "'. $state .'", "msg": "没有待付款的订单"}';
		}else if($state == 2){
			echo '{"state": "'. $state .'", "msg": "没有待发货的订单"}';
		}else if($state == 3){
			echo '{"state": "'. $state .'", "msg": "没有待收货的订单"}';
		}else{
			echo '{"state": "'. $state .'", "msg": "没有待评价的订单"}';
		}
		
	}
		
?>