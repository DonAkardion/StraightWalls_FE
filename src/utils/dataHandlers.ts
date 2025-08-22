/**
 * Видаляє елемент з масиву за ID
 */
export function handleDelete<T extends { id: number }>(
  items: T[],
  id: number
): T[] {
  return items.filter((item) => item.id !== id);
}

/**
 * Додає або оновлює елемент в масиві
 */
export function handleSave<T extends { id: number }>(
  items: T[],
  newItem: T
): T[] {
  const exists = items.some((item) => item.id === newItem.id);

  if (exists) {
    return items.map((item) => (item.id === newItem.id ? newItem : item));
  }

  return [...items, newItem];
}
