import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IItem } from 'src/Types';
import { itemService } from 'src/Services';

export const useHomePageStore = defineStore('HomePage', () => {
	const items = ref<IItem[]>([]);
	const itemsLoading = ref(true);
    
	const fetchItems = async (): Promise<IItem[] | undefined> => {
		const data = await itemService.getAllItem();
		itemsLoading.value = false;
		return data;
	};

	const refetchItems = async () => {
		const data = await fetchItems();
		if (!data) return;
		items.value = data;
	};

	const getItems = async () => {
		if ( items.value.length ) {
			itemsLoading.value = false;
			return items.value;
		}

		const data = await fetchItems();
      
		if (!data) return items.value;
		items.value = data;

		return items.value;
	};

	const getItemWithId = (id: string): IItem | undefined => {
		return items.value.filter((i) => i.id === id)[0];
	};

	return {
		itemsLoading,
		getItems,
		getItemWithId,
		refetchItems,
	};
});