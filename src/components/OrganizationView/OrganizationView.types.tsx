export interface Employee {
  name: string;
  designation?: string;
  subordinates?: Employee[];
}
