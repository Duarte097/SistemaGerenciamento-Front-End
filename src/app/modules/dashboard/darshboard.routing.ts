import { Component } from "@angular/core";
import { DashboardHomeComponent } from "./dashboard-home1/dashboard-home.component";
import { Routes } from "@angular/router";

export const DASHBOARD_ROUTES: Routes =[
  {
    path:'',
    component: DashboardHomeComponent
  }
];
