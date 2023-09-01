

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

$uniq = $_POST['uniq'];

$host        = "host = localhost";
$port        = "port = 5432";
$dbname      = "dbname = coalrrAug2023";
$credentials = "user=postgres password=postgres";

$con = pg_connect( "$host $port $dbname $credentials"  ) or die ("Could not connect to server\n");

$query = "SELECT u_plot_no, owner_name, present_land_use, poss_dt, poss_area from maps.jhajra_owner_join AND 
maps.sonepur_owner_join WHERE u_plot_no = '$uniq';"; 

$result = pg_query($con, $query) or die ("Cannot execute query: $query\n");

// $rs = $db->query($sql); 
// if (!$rs) { 
//     echo "An SQL error occured.\n"; 
//     exit; 
// } 

// while ($row = pg_execute($result, $con, $query)){
// 	echo "$row[0] $row[1] $row[2]\n";
//     //echo "$row[0] $row[1]\n";
// }

pg_close($con);

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