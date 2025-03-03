export const errorMap: Map<string, string> = new Map<string, string>([
    ['Username.Length', 'Длина имени пользователя должна быть строго от 4 до 30 символов.'],
    ['Username.Unallowed', 'Имя пользователя должно быть на латинице, также разрешаются цифры и символы "_" и "-". Оно не может начинаться с цифры или со спец. символов. Оно не может заканчиваться на спец. символы.'],
    ['User.NotFound', 'Данный пользователь не существует.'],
    ['User.AlreadyExists', 'Данный пользователь уже существует.'],
    ['User.Password', 'Неверный пароль.']
]);