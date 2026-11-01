// Компонент календаря выполнения привычки.
// Рендерит календарь и отмечает на нем дни, в которых привычка была выполнена.

import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../Themes';

interface HabitMonthCalendarProps {
    completedDates: string[];       // Массив дней с выполненной привычкой.
    color:          string | null;  // Выбранный цвет привычки.
}

const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const HabitMonthCalendar = ({ 
    completedDates = [], 
    color 
}: HabitMonthCalendarProps) => {
    const { colors } =      useAppTheme();       // Тема
    
    const today =           new Date();
    const currentYear =     today.getFullYear(); // Получаем текущий год...
    const currentMonth =    today.getMonth();    // ...и месяц (0-11).

    // 1. Получаем первый день месяца... 
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    // ...и узнаем, какой это день недели (0 - Вс, 1 - Пн...).
    let startingDayOfWeek = firstDayOfMonth.getDay();
    // В России неделя начинается с понедельника, поэтому корректируем (0 - Вс становится 6). Остальные: индекс -1.
    startingDayOfWeek =     startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    // 2. Узнаем количество дней в месяце
    const daysInMonth =     new Date(currentYear, currentMonth + 1, 0).getDate();

    // 3. Формируем массив ячеек календаря
    const calendarCells = [];

    // Добавляем пустые ячейки для выравнивания первого дня
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarCells.push({ type: 'empty', id: `empty-${i}` });
    }

    // Добавляем сами дни
    for (let day = 1; day <= daysInMonth; day++) {
        // Формирует строку формата ГГГГ-ММ-ДД.
        // padStart добавляет 0 слева месяца и дня, если они меньше 10.
        const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        calendarCells.push({
            type:           'day',
            dayNumber:      day,
            id:             dateString,
            isCompleted:    completedDates.includes(dateString),
            isToday:        day === today.getDate(),
        });
    }

    // Обозначение цветом дней, в которых выполнена привычка.
    const activeColor = color || colors.success;
    const monthName = today.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });

    // Разметка календаря -------------------------------------------------------------------------
    return (
        <View style = {[styles.calendarContainer, { borderTopColor: colors.border }]}>
            <Text style = {[styles.monthTitle, { color: colors.text }]}>{monthName}</Text>

            {/* Заголовки дней недели */}
            <View style = {styles.weekHeader}>
                {WEEK_DAYS.map(day => (
                    <Text 
                        key =   {day} 
                        style = {[styles.weekDayText, { color: colors.textSecondary }]}
                    >
                        {day}
                    </Text>
                ))}
            </View>

            {/* Сетка дней */}
            <View style = {styles.daysGrid}>
                {calendarCells.map((cell) => {
                    // Если ячейка пустая.
                    if (cell.type === 'empty') {
                        return <View 
                            key =   {cell.id} 
                            style = {styles.dayCell} />;
                    }

                    return (
                        <View 
                            key =   {cell.id} 
                            style = {styles.dayCell}
                        >
                            <View
                                style = {[
                                    styles.dayCircle,
                                    cell.isCompleted && { backgroundColor: activeColor, borderColor: activeColor },
                                    cell.isToday && !cell.isCompleted && { borderColor: colors.primary }
                                ]}
                            >
                                <Text
                                    style = {[
                                        styles.dayText,
                                        { color: colors.text },
                                        cell.isCompleted && styles.completedDayText,
                                        cell.isToday && !cell.isCompleted && { color: colors.primary }
                                    ]}
                                >
                                    {cell.dayNumber}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

// Стили ------------------------------------------------------------------------------------------
const styles = StyleSheet.create({
    calendarContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    monthTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        textAlign: 'center',
        textTransform: 'capitalize',
    },
    weekHeader: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    weekDayText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        color: '#999',
        fontWeight: '600',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.28%', // 100% / 7 дней
        aspectRatio: 1, // Квадратные ячейки
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    dayCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    dayText: {
        fontSize: 14,
        color: '#333',
    },

    completedDayText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});