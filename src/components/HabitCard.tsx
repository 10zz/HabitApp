import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useState } from 'react';
import { DataItem } from '../Storage';
import { HabitMonthCalendar } from './HabitMonthCalendar';
import { useAppTheme } from '../Themes';

// Пропсы карточки.
interface HabitCardProps {
    item:               DataItem;               // Единичный элемент хранилища данных пользователя.
    isCompletedToday:   boolean;                // Флаг выполнения привычки сегодня.
    onToggleToday:      (id: string) => void;   // Метод для кнопки переключения выполнения привычки.
    onEdit:             (id: string) => void;   // TODO: Метод для кнопки изменения.
    onDelete:           (id: string) => void;   // Метод для кнопки удаления.
}

export const HabitCard = ({
    item,
    isCompletedToday,
    onToggleToday,
    onEdit,                                                 // TODO
    onDelete 
}: HabitCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);    // Локальное состояние для скрытия/раскрытия календаря.
    const { colors } = useAppTheme();                       // Получаем цвета текущей темы.

    // Разметка карточки --------------------------------------------------------------------------
    return (
        <View style = {[styles.cardContainer, {backgroundColor: colors.card}]}>
            <View style = {styles.cardTopRow}>
                {/* Левая часть: цвет, эмодзи, название */}
                <View style = {styles.cardLeftRow}>
                    {/*Выбранный пользователем цвет конкатенируется к стилю*/}
                    <View style = {[styles.colorDot, {backgroundColor: item.color || colors.textSecondary}]} />
                    {/*Выбранное пользователем эмодзи конкатенируется к стилю*/}
                    <Text style = {styles.cardEmoji}>{item.emoji || '📝'}</Text>
                    <Text style = {[
                        styles.cardTitle,
                        {color: colors.text},
                        isCompletedToday && {color: colors.textSecondary, borderBottomColor: colors.success, borderBottomWidth: 2}
                        ]}>{item.title}</Text>
                </View>
                {/*Правая часть: блок с кнопками действий*/}
                <View style = {styles.cardRightRow}>
                    {/*Кнопка "Удалить"*/}
                    <Pressable onPress={() => onDelete(item.id)} style = {styles.iconButton}>
                        <Text style = {styles.iconText}>🗑️</Text>
                    </Pressable>
                    {/*Кнопка "Выполнить"*/}
                    {/*Если пользователь нажимает на кнопку выполнения, background и граница окрашиваются в выбранный цвет*/}
                    <Pressable
                        onPress={() => onToggleToday(item.id)}
                        style = {[
                            styles.checkButton,
                            { borderColor: colors.border },
                            isCompletedToday && { backgroundColor: item.color || colors.success, borderColor: item.color || colors.success }
                        ]}
                    >
                        <Text style={styles.checkButtonText}>{isCompletedToday ? '✓' : ''}</Text>
                    </Pressable>
                </View>
            </View>
            {/* Кнопка для скрытия/раскрытия календаря */}
            <Pressable
                style={[
                    styles.expandButton, 
                    { borderTopColor: colors.border }
                ]}
                onPress={() => setIsExpanded(!isExpanded)}
            >
                <Text style={[styles.expandButtonText, { color: colors.primary }]}>
                    {isExpanded ? 'Скрыть календарь ▲' : 'Показать календарь ▼'}
                </Text>
            </Pressable>
            {/* Сам календарь, который рендерится только если isExpanded === true */}
            {isExpanded && (
                <HabitMonthCalendar 
                completedDates = {item.completedDates || []} 
                color = {item.color} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    // Контейнер карточки.
    cardContainer: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    // Верхний ряд: контейнер для цвета, эмодзи, названия и кнопок.
    cardTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    // Левый контейнер для цвета, эмодзи и названия.
    cardLeftRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    // Цвет.
    colorDot: { 
        width: 12, 
        height: 40, 
        borderRadius: 6, 
        marginRight: 12 
    },
    // Эмодзи.
    cardEmoji: { 
        fontSize: 24, 
        marginRight: 12 
    },
    // Название.
    cardTitle: { 
        fontSize: 16, 
        fontWeight: '500', 
        flexShrink: 1 
    },
    // Правый контейнер для кнопок.
    cardRightRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconButton: { 
        padding: 4 
    },
    iconText: { 
        fontSize: 18 
    },
    // Кнопка выполнения.
    checkButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
    },
    checkButtonText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 18 
    },
    // Кнопка раскрытия.
    expandButton: {
        marginTop: 12,
        paddingVertical: 8,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    expandButtonText: {
        fontSize: 12,
        color: '#007AFF',
        fontWeight: '500',
    },
});