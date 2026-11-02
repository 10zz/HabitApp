// Компонент выбора цвета из заранее заданного списка.

import { View, StyleSheet, Pressable } from 'react-native';

const COLORS = [
    '#FF3B30', '#FF9500', '#FFCC00', '#4CD964', '#5AC8FA',
    '#007AFF', '#5856D6', '#FF2D55', '#8E8E93', '#000000'
];

interface ColorPickerProps {
    selectedColor: string | null;           // Поле состояния.
    onSelectColor: (color: string) => void; // Метод состояния.
}

export const ColorPicker = ({ 
    selectedColor, 
    onSelectColor 
}: ColorPickerProps) => {
    return (
        <View style = {styles.container}>
            {COLORS.map((color) => {
                const isSelected = selectedColor === color;
                return (
                    <Pressable
                        key =       {color}
                        onPress =   {() => onSelectColor(color)}
                        style =     {[
                            styles.colorItemButton,
                            { backgroundColor: color },
                            isSelected && styles.colorItemButtonSelectedBorder,
                        ]}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginVertical: 12,
        margin: 10,
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
});