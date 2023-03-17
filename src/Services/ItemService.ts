import { AxiosResponse } from 'axios';
import type { IItem } from 'src/Types';
import { apiService } from './ApiService';

class ItemService {
	getAllItem = async (): Promise<IItem[] | undefined> => {
		return await apiService
			.get('/items')
			.then(response => response.data)
			.catch((error: AxiosResponse) => Promise.reject(error));
	};

	createItem = async (item: IItem) => {
		const name = item.name;
		const price = item.price;
		const typeName = item.typeName;
		const types = item.types;
		const details = item.details;
		const images = item.images.map((i) => i.file);

		return await apiService
			.post('/items', {name, price, typeName, types, details, images})
			.then(response => response.data)
			.catch((error: AxiosResponse) => Promise.reject(error));
	};
}

export const itemService = new ItemService();