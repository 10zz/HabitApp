import { DataItem } from '../Storage';

// Проверка на дубликат (по названию, без учета регистра и пробелов)
export const isDuplicateTitle = (title: string, records: DataItem[], excludeId?: string): boolean => {
    const normalizedTitle = title.trim().toLowerCase();
    return records.some(r =>
        r.title.trim().toLowerCase() === normalizedTitle && r.id !== excludeId
    );
};

// Безопасный парсинг записей из хранилища.
export const safeParseRecords = (jsonString: string | undefined): DataItem[] => {
    if (!jsonString) return [];
    try {
        const parsed = JSON.parse(jsonString);
        // Проверяем, что это массив, и фильтруем записи, у которых нет обязательных полей
        if (Array.isArray(parsed)) {
            return parsed.filter(item => item && typeof item.id === 'string' && typeof item.title === 'string');
        }
        return [];
    } catch (e) {
        console.error('Ошибка парсинга данных MMKV:', e);
        return [];
    }
};

// Безопасное сохранение в MMKV.
export const safeSaveRecords = (storage: any, key: string, records: DataItem[]): boolean => {
    try {
        storage.set(key, JSON.stringify(records));
        return true;
    } catch (e) {
        console.error('Ошибка сохранения в MMKV:', e);
        return false;
    }
};