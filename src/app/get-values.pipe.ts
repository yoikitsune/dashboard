import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getValues'
})
export class GetValuesPipe implements PipeTransform {

  transform(value:{[key:string]:any}, ...args: unknown[]): any[] {
    let res:any[] = [];
    for (var prop in value)
      res.push (value[prop]);
    return res;
  }

}
