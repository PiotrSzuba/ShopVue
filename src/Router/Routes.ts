import { HomePage, AccountPage, AddEditPage, ItemPage, CartPage } from 'src/Pages';

export const routes = [
	{
		path: '/',
		name: 'home',
		component: HomePage,
	},
	{
		path: '/account',
		name: 'account',
		component: AccountPage,
	},
	{
		path: '/addItem',
		name: 'addItem',
		component: AddEditPage
	},
	{
		path: '/item/:id',
		name: '/item',
		component: ItemPage
	},
	{
		path: '/cart',
		name: 'cart',
		component: CartPage
	}
];