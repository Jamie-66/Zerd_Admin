<?php  
	include "DBHelper.php";
	  
	$allSql = "select * from product_item where 1;";
	$allArray = query($allSql);
	$allSize = count($allArray);
	if($allSize > 0){
		$arr = array();  
		for ($i = 0; $i < $allSize; $i++) { 
			$arr[] = $allArray[$i];
		}   
		$result = array(  
		    'data' => $arr
		);  
		echo json_encode($result);
	}else{
		echo '{"state": false, "msg": "没有数据"}';
	}
?>