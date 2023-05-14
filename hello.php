<?php
$ip = $_SERVER['REMOTE_ADDR'];
echo "Ok, tutto a posto";
file_put_contents('mioip.txt', $ip);
echo "fatto." ;
?>
