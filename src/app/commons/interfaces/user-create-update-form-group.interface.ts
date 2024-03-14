import {FormControl} from '@angular/forms';

export interface UserCreateUpdateFormInterface {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  avatarBae64: FormControl<string | null>;
}
