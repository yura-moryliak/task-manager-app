import {
  Component, ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";

import {Subscription} from "rxjs";

import {TaskInterface} from "../../commons/interfaces/task.interface";
import {TasksService} from "../../commons/services/tasks.service";
import {TaskComponent} from "./task/task.component";
import {TaskStateEnum} from "../../commons/enums/task-state.enum";

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, TaskComponent, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TasksComponent implements OnInit, OnDestroy {

  private tasksService: TasksService = inject(TasksService);
  private subscriptions: Subscription = new Subscription();
  private taskId: number = 20; // TODO Move after from this place

  @ViewChild('toggleAllTasksElRef')
  private toggleAllTasksElRef: ElementRef<HTMLInputElement> | undefined

  tasksList: TaskInterface[] = [];
  isAllTasksChecked: boolean | null = null;
  areSomeTasksCheckedToDelete: boolean = false;

  ngOnInit(): void {
    this.initTasksList();
  }

  toggleAllTasks(): void {
    this.isAllTasksChecked = !this.isAllTasksChecked;

    this.tasksList.map((task: TaskInterface) => {
      task.checked = this.isAllTasksChecked as boolean;
      return task;
    });
  }

  toggleOne(task: TaskInterface): void {
    task.checked = !task.checked;

    const areSomeTasksUnChecked: boolean = this.tasksList.some((task: TaskInterface) => !task.checked);
    const areAllChecked: boolean = this.tasksList.every((task: TaskInterface) => task.checked);
    const areSomeTasksCheckedToDelete: boolean = this.tasksList.some((task: TaskInterface) => !task.checked);

    if (areSomeTasksUnChecked) {
      this.isAllTasksChecked = null;
      setTimeout(
          () => this.toggleAllTasksElRef!.nativeElement.checked = false,
          100
      );
    }

    if (areAllChecked && !this.isAllTasksChecked) {
      this.isAllTasksChecked = true;
      setTimeout(
          () => this.toggleAllTasksElRef!.nativeElement.checked = true,
          100
      );
    }

    if (areSomeTasksCheckedToDelete) {
      this.areSomeTasksCheckedToDelete = areSomeTasksCheckedToDelete;
    }
  }

  addNew(): void {
    const taskId: number = this.taskId++;
    const taskModel: TaskInterface = {
      id: taskId,
      name: `Task ${taskId}`,
      description: `Description for new Task id ${taskId}`,
      checked: this.isAllTasksChecked as boolean,
      createdAt: new Date(),
      modifiedAt: null,
      state: TaskStateEnum.InQueue
    };
    console.log(taskModel);
    this.tasksService.create(taskModel);
  }

  deleteTasks(): void {

    if (this.areSomeTasksCheckedToDelete) {
      const tasksCheckedToDelete: TaskInterface[] = this.tasksList.filter((task: TaskInterface) => task.checked);
      this.tasksService.deleteSelected(tasksCheckedToDelete);
      this.areSomeTasksCheckedToDelete = false;
      return;
    }

    this.isAllTasksChecked = false;
    this.tasksService.deleteAll();
  }

  deleteOne(event: Event, task: TaskInterface): void {
    event.stopPropagation();
    this.tasksService.delete(task.id);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initTasksList(): void {
    const tasksDataSubscription: Subscription = this.tasksService.tasksList$.subscribe(
        (tasksList: TaskInterface[]) => this.tasksList = tasksList);
    this.subscriptions.add(tasksDataSubscription);
  }
}
