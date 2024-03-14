import {FormControl} from "@angular/forms";

export interface TaskCreateUpdateFormInterface {
  name: FormControl<string | null>;
  description: FormControl<string | null>;
}
