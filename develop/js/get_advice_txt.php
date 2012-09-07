<?php
/*
 ** Основа сценария взята из курса лекций по ajax Учебного центра "Специалист".
 ** Сценарий возвращает совет из списка советов advices.txt.
 ** Параметр num - номер совета
 */

define('ADVICES_FILE', 'advices.txt');
define('NUM', 'num');
header('Content-type: text/plain; charset=utf-8');
// Запрет кеширования
header('Cache-COntrol: no-store, no-cache');
header('Expires: ' . date('r'));
// Чтение файла
$advices = file(ADVICES_FILE);
header('Count-content: ' . count($advices));
if (isset($_GET[NUM])) {
	$num = (int) $_GET[NUM];
	if ($num < count($advices) && $num >= 0)
		echo $advices[$num];
	else
		echo 'Книга не найдена';
} else {
	echo count($advices);
}
?>