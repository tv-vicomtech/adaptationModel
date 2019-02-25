import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoadparamComponent } from './loadParam/loadparam.component';
import { RunapproachComponent } from './runApproach/runapproach.component';

export const routerConfig: Routes = [
    {
        path: 'loadparam',
        component: LoadparamComponent
    },
    {
        path: 'runapproach',
        component: RunapproachComponent
    },
    {
        path: '',
        redirectTo: '/loadparam',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/loadparam',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routerConfig)],
    exports: [RouterModule]
})
export class AppRoutingModule{}
