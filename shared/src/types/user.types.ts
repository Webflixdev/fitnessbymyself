export interface PublicUser {
  id: number;
  email: string;
  name: string | null;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
}
