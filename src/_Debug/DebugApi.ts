/// <reference path="../rosetic/Framework/IApi.ts" />
class DebugApi implements IApi {
  map(x?: number, y?: number, w?: number, h?: number, sx?: number, sy?: number, colorkey?: number, scale?: number, remap?: (tile: number) => void): void {
    
  }
  rect(x: number, y: number, w: number, h: number, color: number): void {
    //console.log(`rect(x: ${x}, y: ${y}, w: ${w}, h: ${h}, color: ${color})`);
  }
  cls(color?: number): void {
    
  }
  btnp(id: number, hold?: number, period?: number): boolean {
    return false;
  }
  btn(id: number): boolean {
    return false;
  }
  reset(): void {
    
  }
  print(str: string, x?: number, y?: number, color?: number, fixed?: boolean, scale?: number): number {
    return 0
  }
  mget(x: number, y: number): number{
    return 0;
  }
  time(): number{
    return new Date().getTime();
  }
  key(code: number): boolean {
    return false;
  }
  trace(msg: any, color?: number): void{
    console.log(msg);
  }
}