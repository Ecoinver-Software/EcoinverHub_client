import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AdminitracionComponent } from './components/adminitracion/adminitracion.component';
import { AppHubComponent } from './components/apphub/apphub.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },


    { path: 'login', component: LoginComponent },
    {
    path: '',
    component: LayoutComponent,
     children: [
        { path: 'home', component: HomeComponent }, 
        {path:'administracion', component:AdminitracionComponent},
        { path: 'apphub', component: AppHubComponent}
     ]
    
    },
    { path: '**', redirectTo: 'login' }

];
