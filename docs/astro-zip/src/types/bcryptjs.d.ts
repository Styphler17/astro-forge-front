declare module 'bcryptjs' {
  interface Bcrypt {
    hash(data: string, saltOrRounds: string | number): Promise<string>;
    hashSync(data: string, saltOrRounds: string | number): string;
    compare(data: string, encrypted: string): Promise<boolean>;
    compareSync(data: string, encrypted: string): boolean;
    genSalt(rounds?: number): Promise<string>;
    genSaltSync(rounds?: number): string;
  }
  
  const bcrypt: Bcrypt;
  export = bcrypt;
} 