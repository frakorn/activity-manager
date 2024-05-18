import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import { TaskListComponent } from './app/task-list/task-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskListComponent],
  template: `
    <app-task-list></app-task-list>
  `,
})
export class App {
  name = 'Angular';
}
bootstrapApplication(App, {providers: [
  provideHttpClient(),
  provideAnimations()
]});
