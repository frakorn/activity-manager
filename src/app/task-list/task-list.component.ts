import { Component, ViewChild } from '@angular/core';
import { Activity } from '../types';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import {
  DxButtonModule,
  DxDataGridModule,
  DxLoadIndicatorModule,
  DxCheckBoxModule,
  DxDataGridComponent,
  DxPopupModule
} from 'devextreme-angular';
import { TaskListService } from './task-list.service';
import { AppAnimationClass, AppInfo, IAppState, ITaskColumns } from './task-list.model';
import { Subscription } from 'rxjs/internal/Subscription';
import { trigger, transition, style, animate, sequence, state } from '@angular/animations';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    DxButtonModule,
    DxDataGridModule,
    DxLoadIndicatorModule,
    DxCheckBoxModule,
    DxPopupModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
  animations: [
    trigger('bounce', [
      state(AppAnimationClass.ACTIVE, style({transform: 'translateY(0)'})),
      transition('* => '+AppAnimationClass.ACTIVE, [
        sequence([
          style({ transform: 'translateY(0)'}),
          animate("400ms cubic-bezier(0,0,0,1)", style({ transform: 'translateY(-14px)' })),
          animate("300ms cubic-bezier(1,0,1,1)", style({ transform: 'translateY(0)' })),
          animate("200ms cubic-bezier(0,0,0,1)", style({ transform: 'translateY(-10px)' })),
          animate("150ms cubic-bezier(1,0,1,1)", style({ transform: 'translateY(0)' })),
          animate("100ms cubic-bezier(0,0,0,1)", style({ transform: 'translateY(-5px)' })),
          animate("80ms cubic-bezier(1,0,1,1)", style({ transform: 'translateY(0)' })),
        ]),
      ])
    ]),
  ]
})
export class TaskListComponent {
  activities: Activity[] = [];
  activitySource: Activity[] = [];
  taskColumns: ITaskColumns[] = [];
  activity!: Activity;
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid!: DxDataGridComponent;
  private breakpointSubscription!: Subscription;
  popupVisible: boolean = false;
  state: string = '';
  appState: IAppState = {};
  appInfo = AppInfo;
  animationClass = AppAnimationClass;

  constructor(private taskListService: TaskListService,
    private breakpointObserver: BreakpointObserver) {
      this.getColumns();
     }

  ngOnInit() {
    this.manageScreenSubscription();
  }

  manageScreenSubscription(){
    // manage columns visibility based on screen size
    this.breakpointSubscription = this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe((state: BreakpointState) => {
      if (state.breakpoints[Breakpoints.Small] || state.breakpoints[Breakpoints.XSmall])
        this.setVisibility(true);
      else
        this.setVisibility(false);
    })
  }

  setVisibility(small?: boolean) {
    this.appState.smallScreenSize = small;
    this.taskColumns.forEach(t => {
      const visibility: boolean = small && t.dataField !== 'activity' ? false : true;
      this.dataGrid?.instance?.columnOption(t.dataField, 'visible', visibility);
    })
  }

  handleContentReady(e: any){
    this.setVisibility(this.appState.smallScreenSize);
  }

  getColumns() {
    // definition of grid columns
    this.taskColumns = [
      {
        dataField: 'activity',
        label: 'Activity',
        dataType: 'string',
        template: 'activityTpl',
      },
      {
        dataField: 'accessibility',
        label: 'Accessibility',
        dataType: 'number',
      },
      {
        dataField: 'type',
        label: 'Type',
        dataType: 'string',
        groupIndex: 0,
      },
      {
        dataField: 'partecipants',
        label: 'Partecipants',
        dataType: 'number',
      },
      {
        dataField: 'price',
        width: 80,
        label: 'Price',
        dataType: 'number',
      },
      {
        dataField: 'link',
        label: 'Link',
        dataType: 'string',
      },
      {
        dataField: 'key',
        width: 130,
        label: 'Key',
        dataType: 'string',
      },
    ];
  }

  fetchActivity() {
    this.appState.isLoading = true;
    this.appState.animation = '';
    this.taskListService.getActivity().subscribe((res: Activity) => {
      console.log("Item:",res);
      this.appState.isLoading = false;
      // if activity already exist don't push in the list
      if (!this.hasActivity(res)) {
        this.activitySource.push(res);
        // group grid by "type" property
        this.dataGrid?.instance?.columnOption('type', 'groupIndex', 0);
        this.successAnimationMsg();
      } // otherwise fetch a new one
      else{
        console.log("Item already exist, fetch new one, previous Item:",res);
        this.fetchActivity();
      }
        
    });
  }

  fetchActivityDetail(key: string) {
    this.appState.isLoading = true;
    this.taskListService.getActivityDetail(key).subscribe((res: Activity) => {
      this.appState.isLoading = false;
      this.activity = res;
      this.popupVisible = true;
    });
  }

  selectRow(row: any) {
    this.fetchActivityDetail(row?.data?.key);
  }

  hasActivity(res: Activity) {
    return this.activitySource.some((a) => a.activity === res.activity);
  }

  getObjectKeys(obj:Activity) {
    return Object.keys(obj);
  }

  getActivityInfo(key: string){
    return this.activity[key as keyof Activity];
  }

  successAnimationMsg(){
    this.appState.animation = this.animationClass.ACTIVE;
    setTimeout(()=>  this.appState.animation = '',2000)
  }

  ngOnDestroy(): void {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }
}
