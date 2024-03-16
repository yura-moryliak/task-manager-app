import {Type} from "@angular/core";

export interface DynamicSidebarConfigInterface<ComponentType = any> {
  component: Type<ComponentType>;
  componentData?: any;
}
