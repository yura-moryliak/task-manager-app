import {FormControl} from '@angular/forms';

export interface UserCreateUpdateFormInterface {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  avatarBase64: FormControl<string | null>;
}
