<?php
	include "DBHelper.php";
	
	$sql = "select * from address_list where 1;";
	$address_arr = query($sql);
	$size = count($address_arr);

	if($size > 0){
		//组织数据  
		$arr = array();  
		for ($i = 0; $i < $size; $i++) { 
			$arr[] = $address_arr[$i];
		}  
		//返回数据  
		$result = array(  
		    'data' => $arr
		);  
		echo json_encode($result);
	}else{
		echo '{"state": false, "msg": "还没有添加地址"}';
	}
	
?>