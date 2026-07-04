<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Получаем данные из формы
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    $car = isset($_POST['car']) ? trim($_POST['car']) : '';
    
    // Валидация
    $errors = [];
    
    if (empty($name)) {
        $errors[] = 'Имя обязательно для заполнения';
    }
    
    if (empty($phone)) {
        $errors[] = 'Телефон обязателен для заполнения';
    }
    
    // Если есть ошибки — возвращаем
    if (!empty($errors)) {
        echo json_encode(['status' => 'error', 'message' => implode(', ', $errors)]);
        exit;
    }
    
    // Формируем письмо
    $to = 'info@key2car.ru';
    $subject = 'Новая заявка на диагностику с сайта KEY2CAR';
    
    $message = "========================================\n";
    $message .= "НОВАЯ ЗАЯВКА НА ДИАГНОСТИКУ\n";
    $message .= "========================================\n\n";
    $message .= "Имя: " . $name . "\n";
    $message .= "Телефон: " . $phone . "\n";
    $message .= "Марка автомобиля: " . ($car ?: 'Не указана') . "\n\n";
    $message .= "========================================\n";
    $message .= "Дата: " . date('d.m.Y H:i:s') . "\n";
    $message .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
    $message .= "========================================\n";
    
    $headers = "From: KEY2CAR <info@key2car.ru>\r\n";
    $headers .= "Reply-To: info@key2car.ru\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Отправка
    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(['status' => 'success', 'message' => 'Заявка успешно отправлена!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Ошибка при отправке. Попробуйте позже.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Некорректный запрос']);
}
?>