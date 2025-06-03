import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },


    { path: 'login', component: LoginComponent },
    {
    path: '',
    component: LayoutComponent,
     children: [
        { path: 'home', component: HomeComponent }, 
     ]
    
    },
    { path: '**', redirectTo: 'login' }

];
