import { NameArg } from '@api/data-access';
import { Injectable, PipeTransform } from '@nestjs/common';
import { Args } from '@nestjs/graphql';

@Injectable()
export class NameReplaceDashPipe implements PipeTransform {
  transform(@Args() nameArg: NameArg): string {
    return nameArg.name.split('-').join(' ');
  }
}
