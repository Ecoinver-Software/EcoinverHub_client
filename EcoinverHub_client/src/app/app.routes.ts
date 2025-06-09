import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { LayoutComponent } from './components/layout/layout.component';

import { AdminitracionComponent } from './components/administracion/administracion.component';

import { AppHubComponent } from './components/apphub/apphub.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { EditorAnunciosComponent } from './components/editor-anuncios/editor-anuncios.component';


export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },


    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'home', component: HomeComponent },
            { path: 'administracion', component: AdminitracionComponent },
            { path: 'apphub', component: AppHubComponent },
            { path: 'perfil', component: PerfilComponent },
            { path: 'editor-anuncios', component: EditorAnunciosComponent }
        ]

    },
    { path: '**', redirectTo: 'login' }

];
