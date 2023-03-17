import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ICartItem, IItem } from 'src/Types';

export const useCartStore = defineStore('cart', () => {
	const cartItems = ref<ICartItem[]>([]);
	const basketPopupVisible = ref<boolean>(false);

	const showBasketPopup = () => {
		basketPopupVisible.value = true;
		setTimeout(() => {
			basketPopupVisible.value = false;
		}, 2000);
	};

	const addToBasket = (item: IItem, quantity: number, type?: string) => {
		const name = type ? `${item.name} - ${type}` : item.name;
		const index = cartItems.value.findIndex((i) => i.name === name);

		if (index !== -1) {
			cartItems.value[index].quantity += quantity;
			showBasketPopup();
			return;
		}

		const cartItem: ICartItem = {
			previewImage: item.images[0].file,
			name: name,
			price: item.price,
			quantity,
			subtotal: quantity * item.price,
		};

		cartItems.value.push(cartItem);

		showBasketPopup();
	};
  
	const deleteFromBasket = (item: ICartItem) => {
		const index = cartItems.value.findIndex((i) => i.name === item.name);

		if (index === -1) return;

		cartItems.value.splice(index, 1);
	};

	const getTotalPrice = () => {
		let price = 0;
	
		cartItems.value.forEach((item) => {
			price += item.price * item.quantity;
		});
	
		return price;
	};

	const getTotalQuantity = () => {
		let quantity = 0;

		cartItems.value.forEach((item) => {
			quantity += item.quantity;
		});

		return quantity;
	};

	return { 
		cartItems, 
		basketPopupVisible,
		addToBasket, 
		getTotalPrice, 
		getTotalQuantity, 
		deleteFromBasket 
	};
});