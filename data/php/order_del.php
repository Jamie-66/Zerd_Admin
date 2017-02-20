<?php
	include "DBHelper.php";

	$indexid = $_POST["indexid"];
	$form = $_POST["form"];

	$sql = "delete from ".$form." where indexid = '$indexid';";

	$result = excute($sql);
	
	//主键重新排序
	$newIndexid1 = "ALTER TABLE  `".$form."` DROP  `indexid` ;";
	$newIndexid2 = "ALTER TABLE `".$form."` ADD `indexid` INT( 11 ) NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (`indexid`);";
	excute($newIndexid1);
	excute($newIndexid2);
	
	if ($result) {
		echo '{"state": true, "msg": "success to delete !!"}';
	}else{
		echo '{"state": false, "msg": "fail to delete !!"}';
	}
?>