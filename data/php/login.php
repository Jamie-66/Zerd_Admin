<?php
	include "DBHelper.php";

	$psw = $_POST["password"];
	$account = $_POST["account"];
	
	$checkSql = "select * from admin where account = '$account' and password = '$psw';";
	$array = query($checkSql);
	if(count($array) > 0){
		echo '{"state": true, "message": "登录成功！"}';
		session_start();
		$_SESSION["account"] = $account;
	}else{
		echo '{"state": false, "message": "登录失败！"}';
	}
?>