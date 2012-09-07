<?php
header('Content-type: text/plain; charset=utf-8');
header('Cache-Control: no-store, no-cache');
header('Expires: ' . date('r'));
$date = $_GET['date'];
$db = new PDO('sqlite:recipe.s3db');
$sql = 'SELECT * FROM recipe WHERE date=Date("'. sqlite_escape_string($date).'")';
$result = $db->query($sql);
$recipes = array();
while ($row = $result->fetch(SQLITE_ASSOC))
	$recipes[] = new Recipe($row['head'], $row['text'], $row['img'], $row['page']);
echo json_encode($recipes);
unset($db);

class Recipe {
	public $head;
	public $text;
	public $img;
	public $page;

	public function __construct($head = '', $text = '', $img = '', $page = '') {

		$this->head = urlencode($head);
		$this->text = urlencode($text);
		$this->img = urlencode($img);
		$this->page = urlencode($page);
	}
}
?>
