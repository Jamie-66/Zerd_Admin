<?php
	include "DBHelper.php";

	session_start();
	if(isset($_SESSION["account"])){
		$sql = "select firstName,lastName from admin where account='".$_SESSION["account"]."';";
		$arr = query($sql);
		
		if(count($arr) < 1){
			echo '{"state": true, "account": "'. $_SESSION["account"] .'"}';
		}else{
			$account = "";
			foreach ($arr[0] as $key => $value) {
				$account = $account.$value." ";
			}
			echo '{"state": true, "account": "'.$account.'"}';
		}
	}else{
		echo '{"state": false}';
	}
?>