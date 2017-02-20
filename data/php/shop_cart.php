<?php
	include "DBHelper.php";

	$sql = "select * from shop_cart where 1";
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
		echo '{"state": false, "msg": "没有数据"}';
	}	
?>