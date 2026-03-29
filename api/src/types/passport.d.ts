import { UserType } from "../models/user";

declare global {
  namespace Express {
    /* eslint-disable @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type */
    interface User extends UserType {}
  }
}
