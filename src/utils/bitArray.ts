export class BitArray {
    private readonly array: Uint32Array;

    constructor(readonly size: number) {
        this.array = new Uint32Array(Math.ceil(size / 32)); // 32ビットごとに1つの整数を使う
    }

    set(index: number, value: boolean) {
        const arrayIndex = Math.floor(index / 32);
        const bitIndex = index % 32;
        if (value) {
            this.array[arrayIndex] |= (1 << bitIndex); // 1をセット
        } else {
            this.array[arrayIndex] &= ~(1 << bitIndex); // 0をセット
        }
    }

    get(index: number): boolean {
        const arrayIndex = Math.floor(index / 32);
        const bitIndex = index % 32;
        return (this.array[arrayIndex] & (1 << bitIndex)) !== 0;
    }
}