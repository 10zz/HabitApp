import { StyleSheet, View, ScrollView, Text, TextInput, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import EmojiPicker from 'react-native-emoji-chooser';
import { DataItem, USER_DATA_STORAGE_KEY, storage } from '../Storage';
import { useAppTheme } from '../Themes';

// Список доступных для выбора цветов.
const COLORS = [
    '#FF3B30', // Красный
    '#FF9500', // Оранжевый
    '#FFCC00', // Желтый
    '#4CD964', // Зеленый
    '#5AC8FA', // Голубой
    '#007AFF', // Синий
    '#5856D6', // Фиолетовый
    '#FF2D55', // Розовый
    '#8E8E93', // Серый
    '#000000', // Черный
];

export default function CreateScreen() {
    const navigation =                                      useNavigation(); // Хук для методов навигации между экранами.
    const { colors, isDark, setMode } =                     useAppTheme();
    const [title, setTitle] =                               useState(''); // Выбранное пользователем название привычки.
    const [selectedEmoji, setSelectedEmoji] =               useState<string | null>(null); // Выбранное пользователем эмодзи.
    const [selectedColor, setSelectedColor] =               useState<string | null>(null); // Выбранный пользователем цвет.
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState<boolean>(false); // Флаг видимости меню выбора эмодзи.

    // Обработчики кнопок ---------------------------------------------------------------------------
    // Кнопка выбора эмодзи.
    const handleSelectEmoji = (emoji: string) => {
        setSelectedEmoji(emoji);
        setIsEmojiPickerVisible(false); // Скрываем селектор после выбора
    };

    // Кнопка отмены выбора эмодзи.
    const handleClearEmoji = () => {
        setSelectedEmoji(null);
        setIsEmojiPickerVisible(false);
    };

    // Кнопка "Сохранить".
    const handleSave = () => {
        if (!title.trim()) {                            // Если поле "Название" пусто...
            Alert.alert('Ошибка', 'Введите название');  // Вывести сообщение об ошибке.
            return;
        }

        // 1. Получаем текущий список из MMKV.
        const existingRecordsString = storage.getString(USER_DATA_STORAGE_KEY);
        const existingRecords: DataItem[] = existingRecordsString
            ? JSON.parse(existingRecordsString)
            : [];

        // 2. Создаем новую запись.
        const newRecord: DataItem = {
            id: Date.now().toString(), // Уникальный ID на основе времени
            title: title,
            emoji: selectedEmoji,
            color: selectedColor,
            createdAt: Date.now(),
            completedDates: [],
        };

        // 3. Добавляем в список и сохраняем обратно
        const updatedRecords = [...existingRecords, newRecord];
        storage.set(USER_DATA_STORAGE_KEY, JSON.stringify(updatedRecords));

        // 4. Очищаем значения полей и возвращаемся на главный экран.
        setTitle('');
        setSelectedEmoji(null);
        setSelectedColor(null);
        navigation.goBack();
    };

    // Добавляем кнопкe смены темы в Header справа хуком useLayoutEffect 
    useLayoutEffect(() => {
        navigation.setOptions({
            // Меняем цвет хедера и текста в зависимости от темы.
            headerStyle: { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' },
            headerTintColor: colors.text,
            headerRight: () => (
                <Pressable 
                    onPress = {() => setMode(isDark ? 'light' : 'dark')}
                    style = {styles.themeButton}
                >
                    <Text>{isDark ? '☀️' : '🌙'}</Text>
                </Pressable>
            ),
        });
    // Кнопка обновляла свой текст при смене фильтра, состояния хука или темы.
    }, [navigation, colors, isDark]);

    // Разметка экрана ----------------------------------------------------------------------------
    return (
        <SafeAreaView style={[styles.mainContainer, { backgroundColor: colors.background }]}>
            {/* Поле названия */}
            <TextInput
                placeholder =           'Название'
                placeholderTextColor =  {colors.textSecondary}
                value =                 {title}
                onChangeText =          {setTitle}
                style =                 {[styles.titleInput, { 
                    backgroundColor: colors.inputBg, 
                    color: colors.text, 
                    borderColor: colors.border 
                }]}
            />
            {/* Кнопка эмодзи */}
            <View style={styles.emojiContainer}>
                <Pressable
                    style =     {styles.emojiButton}
                    onPress =   {() => setIsEmojiPickerVisible(!isEmojiPickerVisible)}
                >
                    {selectedEmoji ? (
                        <Text style = {styles.emojiDisplay}>{selectedEmoji}</Text>
                    ) : (
                        <Text style = {styles.emojiButtonText}>Выбрать эмодзи</Text>
                    )}
                </Pressable>
                {/* Кнопка отмены выбора эмодзи. Появляется только если эмодзи выбран */}
                {selectedEmoji && (
                    <Pressable 
                        onPress =   {handleClearEmoji}
                        style =     {styles.clearButton} 
                    >
                        <Text style = {styles.clearButtonText}>✕</Text>
                    </Pressable>
                )}
            </View>
            {/* Селектор эмодзи */}
            {isEmojiPickerVisible && (
                <View style = {styles.emojiPickerContainer}>
                    <EmojiPicker
                        onSelect =      {handleSelectEmoji}
                        mode =          {isDark ? "dark" : "light"}
                        lang =          "en"
                        columnCount =   {8}
                    />
                </View>
            )}
            {/* Селектор цвета */}
            <View style = {styles.colorPickHeader}>
                <Text style = {[styles.colorPickHeaderText, {color: colors.text}]}>Цвет:</Text>
                {/* Отображение выбранного цвета и кнопка сброса */}
                {selectedColor ? (
                    <>
                        <View style = {[styles.colorPreview, { backgroundColor: selectedColor }]} />
                        <Pressable 
                            onPress =   {() => setSelectedColor(null)} 
                            style =     {styles.clearButton}
                        >
                            <Text style = {styles.clearButtonText}>✕</Text>
                        </Pressable>
                    </>
                ) : (
                    <Text style = {styles.colorClearButtonPlaceholderText}>Не выбран</Text>
                )}
            </View>
            {/* Горизонтальный скролл с цветами */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator =    {false}
                contentContainerStyle =             {styles.colorScroll}
            >
                {COLORS.map((color) => {
                    const isSelected = selectedColor === color;
                    return (
                        <Pressable
                            key =       {color}
                            onPress =   {() => setSelectedColor(color)}
                            style =     {[
                                styles.colorItemButton,
                                { backgroundColor: color },
                                isSelected && styles.colorItemButtonSelectedBorder,
                            ]}
                        />
                    );
                })}
            </ScrollView>
            {/* Кнопка сохранения */}
            <Pressable 
                style =     {[styles.saveButton, { backgroundColor: colors.success }]}
                onPress =   {handleSave}
            >
                <Text style = {styles.saveButtonText}>Сохранить запись</Text>
            </Pressable>
        </SafeAreaView>
    );
}

// Стили ------------------------------------------------------------------------------------------
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    // Поле названия.
    titleInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        margin: 10,
    },
    // Кнопка смены темы.
    themeButton: {
        margin: 10
    },
    // Стили для секции выбора эмодзи. ------------------------------------------------------------
    emojiContainer: {
        position: 'relative',
        height: 120,
    },
    // Кнопка.
    emojiButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        margin: 10
    },
    // Текст кнопки.
    emojiButtonText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: 'bold',
    },
    // Выбранное эмодзи.
    emojiDisplay: {
        fontSize: 48,
    },
    // Селектор эмодзи.
    emojiPickerContainer: {
        flex: 1,
        minHeight: 250,
        borderWidth: 5,
        borderColor: '#200707',
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 10,
    },
    // Стили для кнопок отмены выбора. ------------------------------------------------------------
    clearButton: {
        position: 'absolute',
        right: 0,
        backgroundColor: '#ff3b30',
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    // Стили для секции выбора цвета. -------------------------------------------------------------
    colorPickHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
        justifyContent: 'space-between',
    },
    colorPickHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    colorClearButtonPlaceholderText: {
        color: '#999',
        fontSize: 14,
    },
    colorPreview: {
        width: 124,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    colorScroll: {
        padding: 5,
        gap: 12,
        paddingVertical: 8,
    },
    // Круглые кнопки выбора цвета.
    colorItemButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    // Обводка кнопки кнопки выбора цвета при нажатии.
    colorItemButtonSelectedBorder: {
        borderWidth: 3,
        borderColor: '#007AFF',
        transform: [{ scale: 1.1 }],
    },
    saveButton: {
        backgroundColor: '#34C759',
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
});