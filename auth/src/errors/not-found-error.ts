import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  statusCode = 404; 
  reason = 'Route not found';

  constructor() {
    super('Route Not Found');  
    Object.setPrototypeOf(this, NotFoundError.prototype);
  } 
  serializeErrors() {
    return [{ message: this.reason }];
  } 
};