



export class Modifier {
    constructor(
        public name: string,
        public add: number = 0,
        public multiply: number = 1,
        public spawnRate: number = 1,
        public onHit?: (apple: any) => void // Define the type of apple if needed
    ) {
        this.name = name;
        this.add = add;
        this.multiply = multiply;
        this.spawnRate = spawnRate;
        this.onHit = onHit;
    }

    public applyModifiers(apple: any) {
        apple.value += this.add;
        apple.value *= this.multiply;
        // Apply spawn rate and onHit effects if needed
    }
}