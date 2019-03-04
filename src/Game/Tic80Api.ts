class Tic80Api implements IApi {
  map(x?: number, y?: number, w?: number, h?: number, sx?: number, sy?: number, colorkey?: number, scale?: number, remap?: (tile: number) => void): void {
    map(x, y, w, h, sx, sy, colorkey, scale, remap);
  }
  rect(x: number, y: number, w: number, h: number, color: number): void {
    rect(x, y, w, h, color);
  }
  cls(color?: number): void {
    cls(color);
  }
  btnp(id: number, hold?: number, period?: number): boolean {
    return btnp(id, hold, period);
  }
  btn(id: number): boolean {
    return btn(id);
  }
  reset(): void {
    reset();
  }
  print(str: string, x?: number, y?: number, color?: number, fixed?: boolean, scale?: number): number {
    return print(str, x, y, color, fixed, scale);
  }
  mget(x: number, y: number): number{
    return mget(x, y);
  }
  time(): number{
    return time();
  }
  key(code: number): boolean {
    return key(code);
  }
  trace(msg: any, color?: number): void {
    trace(msg, color);
  }
}