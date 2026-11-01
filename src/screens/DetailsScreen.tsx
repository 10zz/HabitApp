import { StyleSheet, View, Text, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmojiPicker from 'react-native-emoji-chooser';
import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { storage, USER_DATA_STORAGE_KEY, DataItem } from '../Storage';
import { useAppTheme } from '../Themes';
import { HabitMonthCalendar } from '../components/HabitMonthCalendar';
import { ColorPicker } from '../components/ColorPicker';

export default function DetailsScreen() {
    const { colors, isDark, setMode } =             useAppTheme();                      // Тема.
    const navigation =                              useNavigation();                    // Хук для добавления кнопки смены темы на верхнюю панель.

    const route =                                   useRoute<any>();                    // Рутер для получения деталей конкретной записи.
    const { id } =                                  route.params;                       // ИД записи

    const [record, setRecord] =                     useState<DataItem | null>(null);    // Запись о привычке из хранилища.

    // Редактирование
    const [isEditing, setIsEditing] =               useState(false);                    // Флаг режима редактирования.
    const [editTitle, setEditTitle] =               useState('');                       // Поле названия.
    const [editEmoji, setEditEmoji] =               useState<string | null>(null);      // Поле эмодзи.
    const [editColor, setEditColor] =               useState<string | null>(null);      // Поле цвета.
    const [isPickerVisible, setIsPickerVisible] =   useState(false);                    //

    // Добавляем кнопкe смены темы в Header справа хуком useLayoutEffect 
    useLayoutEffect(() => {
        navigation.setOptions({
            // Меняем цвет хедера и текста в зависимости от темы.
            headerStyle: { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' },
            headerTintColor: colors.text,
            headerRight: () => (
                <Pressable 
                    onPress = {() => setMode(isDark ? 'light' : 'dark')}
                >
                    <Text>{isDark ? '☀️' : '🌙'}</Text>
                </Pressable>
            ),
        });
    // Кнопка обновляла свой текст при смене фильтра, состояния хука или темы.
    }, [colors, isDark]);

    // Хук для обновления данных о привычке при изменении ИД.
    useEffect(() => {
        const recordsString = storage.getString(USER_DATA_STORAGE_KEY);
        const records: DataItem[] = recordsString ? JSON.parse(recordsString) : [];
        const found = records.find(r => r.id === id);
        if (found) {
            setRecord(found);
            setEditTitle(found.title);
            setEditEmoji(found.emoji);
            setEditColor(found.color);
        }
    }, [id]);

    if (!record) return null;

    const handleSave = () => {
        if (!editTitle.trim()) {                        // Если поле "Название" пусто...
            Alert.alert('Ошибка', 'Введите название');  // Вывести сообщение об ошибке.
            return;
        }

        // 1. Получаем текущий список из MMKV.
        const recordsString = storage.getString(USER_DATA_STORAGE_KEY);
        const records: DataItem[] = recordsString ? JSON.parse(recordsString) : [];

        // 2. Обновляем список в MMKV.
        const updatedRecords = records.map(r =>
            r.id === id ? { ...r, title: editTitle, emoji: editEmoji, color: editColor } : r
        );
        storage.set(USER_DATA_STORAGE_KEY, JSON.stringify(updatedRecords));

        // 3. Обновляем поля состояний и выходим из режима редактирования.
        setRecord({ ...record!, title: editTitle, emoji: editEmoji, color: editColor });
        setIsEditing(false);
    };

    // Форматирование даты (ДД месяц ГГГГ г.).
    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Разметка экрана ----------------------------------------------------------------------------
    return (
        <SafeAreaView style = {[styles.container, { backgroundColor: colors.background }]}>
            <View style = {styles.scrollContainer}>
                
                {/* Кнопка "Редактировать" */}
                <Pressable
                    style =     {[styles.editToggleButton, { backgroundColor: isEditing ? colors.danger : colors.primary }]}
                    onPress =   {() => setIsEditing(!isEditing)}
                >
                    <Text style = {styles.editToggleText}>{isEditing ? 'Отменить' : 'Редактировать'}</Text>
                </Pressable>

                {isEditing ? (
                    // Режим редактирования. ------------------------------------------------------
                    <View>

                        {/* Поле названия */}
                        <TextInput
                            value =                 {editTitle}
                            onChangeText =          {setEditTitle}
                            placeholder =           "Название"
                            placeholderTextColor =  {colors.textSecondary}
                            style =                 {[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
                        />

                        {/* Кнопка эмодзи */}
                        <Pressable 
                            style =     {[styles.emojiButton, { backgroundColor: colors.card, borderColor: colors.border }]} 
                            onPress =   {() => setIsPickerVisible(!isPickerVisible)}
                        >
                            {editEmoji ? 
                                <Text style = {styles.emojiDisplay}>{editEmoji}</Text> : 
                                <Text style = {{color: colors.primary}}>Выбрать эмодзи</Text>
                            }
                        </Pressable>

                        {/* Селектор эмодзи */}
                        {isPickerVisible && (
                            <View style = {styles.pickerContainer}>
                                <EmojiPicker
                                    onSelect =      {(e) => { setEditEmoji(e); setIsPickerVisible(false); }}
                                    mode =          {isDark ? "dark" : "light"}
                                    lang =          "en" 
                                    columnCount =   {8}
                                />
                            </View>
                        )}

                        {/* Селектор цвета */}
                        <Text style = {[styles.colorPickHeaderText, {color: colors.text}]}>Цвет:</Text>
                        <ColorPicker
                            selectedColor = {editColor}
                            onSelectColor = {setEditColor}
                        />

                        {/* Кнопка сохранения */}
                        <Pressable 
                            style =     {[styles.saveButton, { backgroundColor: colors.success }]} 
                            onPress =   {handleSave}
                        >
                            <Text style = {styles.saveButtonText}>Сохранить изменения</Text>
                        </Pressable>
                    </View>
                ) : (
                    // Режим просмотра. -----------------------------------------------------------
                    <View style = {styles.viewContainer}>
                        <View style = {styles.headerRow}>
                            <Text style = {styles.emojiDisplayLarge}>{record.emoji || '📝'}</Text>
                            <View>
                                <Text style = {[styles.titleText, { color: colors.text }]}>{record.title}</Text>
                                {/* Выводим дату создания */}
                                <Text style = {[styles.dateText, { color: colors.textSecondary }]}>
                                    Создано: {formatDate(record.createdAt)}
                                </Text>
                            </View>
                        </View>

                        <Text style = {[styles.subtitle, { color: colors.textSecondary }]}>Статистика:</Text>
                        <HabitMonthCalendar completedDates = {record.completedDates || []} color = {record.color} />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

// Стили ------------------------------------------------------------------------------------------
const styles = StyleSheet.create({
    container: { 
        flex: 1 
    },
    scrollContainer: { 
        padding: 16, 
        gap: 16 
    },
    input: { 
        borderWidth: 1, 
        borderRadius: 8, 
        padding: 10, 
        fontSize: 16 
    },
    emojiButton: { 
        height: 100, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 12, 
        borderWidth: 1 
    },
    emojiDisplay: { 
        fontSize: 64 
    },
    pickerContainer: { 
        height: 300, 
        borderWidth: 1, 
        borderColor: '#eee', 
        borderRadius: 12, 
        overflow: 'hidden' 
    },
    saveButton: { 
        padding: 16, 
        borderRadius: 12, 
        alignItems: 'center', 
        marginTop: 20 
    },
    saveButtonText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    editToggleButton: { 
        padding: 12, 
        borderRadius: 8, 
        alignItems: 'center' 
    },
    editToggleText: { 
        color: '#fff', 
        fontWeight: 'bold' 
    },
    // Стили для режима просмотра
    viewContainer: { 
        marginTop: 10 
    },
    headerRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 20, 
        gap: 16 
    },
    emojiDisplayLarge: { 
        fontSize: 48 
    },
    titleText: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 4 
    },
    dateText: { 
        fontSize: 14 
    },
    subtitle: { 
        fontSize: 16, 
        fontWeight: '600', 
        marginBottom: 12, 
        marginTop: 20 
    },
    colorPickHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});