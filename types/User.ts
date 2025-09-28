export interface User {
  _id: string;
  email: string;
  fname: string;
  lname: string;
  phone: number;
  role: string;
  status: string;
  department:{
    _id: string;
    name : string
  } 
  username: string;
  createdAt: string;
  updatedAt: string;
  joinedAt: string;
}
