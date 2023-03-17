interface IListItem<T> {
	value: T;
	deleting: boolean;
	offsetY: number;
	ref: HTMLElement | null;
}

export class DnDList<T> {
	public draggedIndex = -1;
	public draggedOverIndex = -1;
	private droppedIn = false;
	private draggedRef: HTMLElement | null = null;
	public itemsList: IListItem<T>[] = [];
    
	constructor(
		private items: T[],
		private disabled: boolean,
		public onOrderChange?: (index1: number, index2: number) => void
	) {
		this.setItems(items);
	}

	setItems(items: T[]) {
		this.itemsList = [...items.map<IListItem<T>>((value) => {
			return { value, deleting: false, offsetY: 0, ref: null };
		})];
	}

	addItem(value: T) {
		this.itemsList.push({ value, deleting: false, offsetY: 0, ref: null });
	}

	changeOrder (index: number) {
		const temp = this.itemsList[index];
		this.itemsList[index] = this.itemsList[this.draggedIndex];
		this.itemsList[this.draggedIndex] = temp;

		if (this.onOrderChange) {
			this.onOrderChange(index, this.draggedIndex);
		}
	}

	deleteItem(index: number) {
		this.itemsList.splice(index, 1);
	}

	changeItem(value: T, index: number) {
		this.itemsList[index].value = value;
	}

	setRef(ref: HTMLElement | null, index: number) {
		this.itemsList[index].ref = ref;
	}

	onDragStart(event: DragEvent, index: number, ref: HTMLElement | null) {
		if (this.disabled || !this.onOrderChange || !event.dataTransfer || !ref) return;
		
		const data = event.dataTransfer.getData('text/plain');
		if (data) return;

		this.draggedIndex = index;
		this.draggedRef = ref;
		this.itemsList[index].ref = ref;

		event.dataTransfer.setData('text/plain', 'blockOtherDnd');
	}
    
	onDragOver(event: DragEvent, index: number) {
		event.preventDefault();
		if (this.disabled || !this.onOrderChange || !event.dataTransfer || this.draggedIndex === -1) return;

		this.draggedOverIndex = index;

		if (this.itemsList[index].value) return;

		event.dataTransfer.dropEffect = 'none';
	}

	onDragEnd() {
		if (this.droppedIn) return;
		this.draggedIndex = -1;
		this.draggedOverIndex = -1;
	}

	onDrop(index: number, ref: HTMLElement | null) {
		if (this.disabled || !this.onOrderChange || !this.itemsList[index].value || 
			this.draggedIndex < 0 || !ref || !this.draggedRef) return;
			
		const sourceElementHeight = this.draggedRef.offsetHeight;	
		const targetElementHeight = ref.offsetHeight;

		if (!targetElementHeight || !sourceElementHeight) return;
		this.droppedIn = true;

		let itemsToChange = index - this.draggedIndex;

		if (itemsToChange === 0) {
			this.draggedIndex = -1;
			this.droppedIn = false;
			return;
		}

		let startIndex = this.draggedIndex;	
		let invert = 1;
		let additionalSpace = 0;
		
		if (index < this.draggedIndex) {
			itemsToChange = -itemsToChange;
			invert = -1;
			startIndex = index;
		}

		for (let idx = startIndex + 1; idx < itemsToChange; idx++) {
			additionalSpace += this.itemsList[idx].ref?.offsetHeight ?? 0;
		}

		if (startIndex + 1 === itemsToChange && startIndex !== 0) {
			this.itemsList[startIndex + 1].offsetY = invert * (targetElementHeight - sourceElementHeight);
		}
		
		if (startIndex + 3 === this.itemsList.length && itemsToChange === 2 && startIndex !== 0) {
			additionalSpace = this.itemsList[startIndex + 1].ref?.offsetHeight ?? 0;
			this.itemsList[startIndex + 1].offsetY = invert * (targetElementHeight - sourceElementHeight);
		}

		if (sourceElementHeight !== targetElementHeight && additionalSpace !== 0) {
			for (let idx = startIndex + 1; idx < itemsToChange; idx++) {
				this.itemsList[idx].offsetY = invert * (targetElementHeight - sourceElementHeight);
			}
		}

		this.itemsList[index].offsetY = -1 * invert * (additionalSpace + sourceElementHeight + 1);
		this.itemsList[this.draggedIndex].offsetY = invert * (additionalSpace + targetElementHeight + 1);

		this.draggedOverIndex = -1;
    
		setTimeout(() => {
			this.changeOrder(index);	
			this.resetOffset();

			this.draggedIndex = -1;
			this.droppedIn = false;
		}, 300);
	}

	private resetOffset() {
		for (let index = 0; index < this.itemsList.length; index++) {
			this.itemsList[index].offsetY = 0;		
		}
	}
}