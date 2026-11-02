import { DataItem } from '../Storage';

// Получаем строку даты в формате ГГГГ-ММ-ДД.
export const formatDateString = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// Расчет текущей серии (Streak).
export const calculateStreak = (completedDates: string[] = []): number => {
    if (completedDates.length === 0) 
        return 0;

    let streak =                0;
    const today =               new Date();
    const todayString =         formatDateString(today);

    // Проверяем, выполнена ли привычка сегодня.
    const isCompletedToday =    completedDates.includes(todayString);

    // Если сегодня не выполнено, серия начинается со вчерашнего дня.
    let checkDate = new Date(today);
    if (!isCompletedToday) {
        checkDate.setDate(checkDate.getDate() - 1);
    }

    // Идем назад по дням, пока находим выполненные даты.
    while (true) {
        const dateStr = formatDateString(checkDate);
        if (completedDates.includes(dateStr)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break; // Прерываем, если нашли пропуск.
        }
    }

    return streak;
};

// Расчет процента выполнения.
export const calculateCompletionRate = (completedDates: string[] = [], createdAt: number): number => {

    // Если нет даты создания (старые записи), берем сегодня.
    const createdDate = createdAt ? new Date(createdAt) : new Date();
    const today = new Date();

    // Считаем общее количество дней с момента создания по сегодняшний день
    // Используем разницу в миллисекундах и делим на количество мс в дне
    const timeDiff = today.getTime() - createdDate.getTime();
    const totalDays = Math.max(1, Math.floor(timeDiff / (1000 * 3600 * 24)) + 1); // +1, чтобы включить день создания

    // Количество выполненных дней (уникальных).
    const uniqueCompletedDays = new Set(completedDates).size;

    // Процент с округлением.
    const rate = Math.round((uniqueCompletedDays / totalDays) * 100);

    // Ограничиваем максимум 100%.
    return Math.min(rate, 100);
};