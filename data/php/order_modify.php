<?php
	include "DBHelper.php";

	$form = $_POST["form"];
	$indexid = $_POST['indexid'];
	$order_modify = $_POST['obj'];
	$sql = "update ".$form." set ";
	$order_modify = json_decode($order_modify);
	foreach ($order_modify as $key => $value) {
		$sql = $sql.$key."='".$value."',";
	}
	$len = strlen($sql); 
	$sql = substr($sql,0,$len-1);
	$sql = $sql." where indexid='".$indexid."';";
	$result = excute($sql);
	if($result){
		echo '{"state": true, "msg": "success to modify!!"}';
	}else{
		echo '{"state": false, "msg": "fail to modify!!"}';
	}
?>