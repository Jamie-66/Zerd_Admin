<?php
	include "DBHelper.php";

	$state = $_POST["state"];
	$password = $_POST["password"];

	if($state == '1'){
		$firstName = $_POST["firstName"];
		$lastName = $_POST["lastName"];
		$sql = "update admin set password ='".$password."',firstName = '".$firstName."',lastName = '".$lastName."' where 1;";
		$result = excute($sql);

	}else{
		$sql = "update admin set password ='". $password ."' where 1;";
		$result = excute($sql);
	}
	if($result){
		echo '{"state": true, "msg": "success to modify!!"}';
	}else{
		echo '{"state": false, "msg": "fail to modify!!"}';
	}
?>