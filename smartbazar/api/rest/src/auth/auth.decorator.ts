import { SetMetadata } from '@nestjs/common';

export const Roles = (...args: string[]) => SetMetadata('roles', args);

export const AllowAnonymous = () => SetMetadata('allow-anonymous', true);
