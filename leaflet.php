

// $server = 'localhost';
// $username = 'postgres';
// $password = 'postgres';
// $db_name = 'COALRRJhajra';

// $dbconn = pg_connect("host=$server port=5432 dbname=$db_name user=$username password=$password");

// $uniq = $_GET['uniq'];
// $dbquery = "SELECT 'text', layer, lgd_code, unique_cod from public.jhajra_owner_join AND public.sonepur_owner_join WHERE u_plot_no = '$uniq';";

// $query_conn = pg_query($dbconn, $dbquery);

// pg_close($dbconn); 

<?php 
$server = 'localhost';
$username = 'postgres';
$password = 'postgres';
$db_name = 'coalrrAug2023';
$db = new PDO("host=$server port=5432 dbname=$db_name user=$username password=$password"); 
$sql = "SELECT u_plot_no, owner_name, present_land_use, poss_dt, poss_area from maps.jhajra_owner_join AND maps.sonepur_owner_join WHERE u_plot_no = '$uniq';"; 

$rs = $db->query($sql); 
if (!$rs) { 
    echo "An SQL error occured.\n"; 
    exit; 
} 

$rows = array(); 
while($r = $rs->fetch(PDO::FETCH_ASSOC)) { 
    $rows[] = $r; 
    $name[] = $r['u_plot_no'];
    $user_date[] = $r['owner_name'];
    $user_time[] = $r['present_land_use'];
    $address[] = $r['poss_dt'];
    $icon_name[] = $r['poss_area'];
} 
print json_encode($rows); 
$db = NULL; 
?> 